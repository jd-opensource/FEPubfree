import { Inject, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as assert from "assert";
import * as _ from "lodash";
import { isNil } from "lodash";
import { getConnection, In, QueryRunner } from "typeorm";
import { GroupRepo } from "../entity/group";
import { Project, ProjectRepo } from "../entity/project";
import { ProjectDomainRepo } from "../entity/project-domain";
import { EProjectEnvType, ProjectEnvRepo } from "../entity/project-env";
import { ProjectEnvDeployRepo } from "../entity/project-env-deploy";
import { EProjectMemberRole, ProjectMemberRepo } from "../entity/project-member";
import { User, UserRepo } from "../entity/user";
import { CustomError } from "../error/custom-error";
import { IProjectCreateBody, IProjectDTO } from "../interface/project.interface";
import { queryRunnerRepo } from "../util/query-runner-repo";

@Provide()
export class ProjectSrv {
  @Inject()
  private ctx: Context;

  @Inject()
  private logger: ILogger;

  /**
   * 创建项目
   * 1、新建项目
   * 2、给当前创建者分配项目 master 权限
   * 3、创建默认 env
   */
  async createProject(params: IProjectCreateBody): Promise<Project> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const projectRepo = queryRunnerRepo(ProjectRepo, queryRunner);
      const existed = await projectRepo.findOne({ name: params.name, isDel: false });
      assert(_.isNil(existed), CustomError.new(`项目 ${params.name} 已存在`));

      let resultProject: Project;
      if (_.isNil(params.groupId)) {
        resultProject = await this.createPersonalProject(params, queryRunner);
      } else {
        resultProject = await this.createGroupProject(params, queryRunner);
      }

      // 添加默认 Master 权限
      await this.addProjectRole(
        resultProject.id,
        {
          userId: this.ctx.loginUser.id,
          role: EProjectMemberRole.Master,
        },
        queryRunner
      );
      // 创建默认环境
      await this.createDefaultProjectEnv(resultProject.id, queryRunner);

      await queryRunner.commitTransaction();
      return resultProject;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询项目
   */
  async getProjects(
    type: "self" | "all",
    params: { page: number; size: number }
  ): Promise<{ projects: IProjectDTO[]; total: number }> {
    const { page, size } = params;
    const offset = (page - 1) * size;
    const limit = size;

    const { id: userId } = this.ctx.loginUser;

    let projects = [];
    let total: number;

    if (type === "self") {
      // 寻找 project_member 表中有权限的项目
      const projectMemberRepo = queryRunnerRepo(ProjectMemberRepo);
      const projectIds = (
        await projectMemberRepo.find({
          select: ["projectId"],
          where: {
            userId: userId,
            isDel: false,
          },
        })
      ).map((v) => v.projectId);

      // 查询复合条件的项目数
      const projectRepo = queryRunnerRepo(ProjectRepo);
      const findRes = await projectRepo.findAndCount({
        where: [
          {
            id: In(projectIds),
            isDel: false,
          },
          {
            ownerId: userId,
            isDel: false,
          },
        ],
        order: {
          id: "DESC",
        },
        skip: offset,
        take: limit,
      });
      projects = findRes[0];
      total = findRes[1];
    }

    if (type === "all") {
      // 查询复合条件的项目数
      const projectRepo = queryRunnerRepo(ProjectRepo);
      const findRes = await projectRepo.findAndCount({
        where: {
          isDel: false,
        },
        order: {
          id: "DESC",
        },
        skip: offset,
        take: limit,
      });
      projects = findRes[0];
      total = findRes[1];
    }

    // 补充相关人员信息信息
    const createUserIds = projects.map((project) => project.createUserId);
    const userRepo = queryRunnerRepo(UserRepo);
    const users = await userRepo.find({
      where: {
        id: In(createUserIds),
        isDel: false,
      },
    });
    const usersMap = new Map(users.map((user) => [user.id, user]));

    const result = projects.map((iProject): IProjectDTO => {
      return {
        ...iProject,
        createUser: User.purify(usersMap.get(iProject.createUserId)),
      };
    });

    return {
      projects: result,
      total: total,
    };
  }

  /**
   * 查询单个项目详情
   * @param projectId
   */
  async getProject(projectId: number): Promise<IProjectDTO> {
    const projectRepo = queryRunnerRepo(ProjectRepo);
    const project = await projectRepo.findOne({ id: projectId, isDel: false });
    if (!isNil(project)) {
      const userRepo = queryRunnerRepo(UserRepo);
      const createUser = await userRepo.findOne({
        id: project.createUserId,
        isDel: false,
      });
      return {
        ...project,
        createUser: User.purify(createUser),
      };
    }
    return null;
  }

  /**
   * 删除项目
   * 删除项目前，确保以下几点
   * 1、该项目下不再存在 project-domain 配置
   *
   * 删除过程
   * 1、删除所有工作区
   * 2、删除所有的项目部署记录
   * 3、删除所有的项目成员信息
   * 4、删除项目信息
   */
  async deleteProject(projectId: number) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const projectRepo = queryRunnerRepo(ProjectRepo, queryRunner);
      const project = await projectRepo.findOne({ id: projectId, isDel: false });

      assert(!_.isNil(project), CustomError.new(`项目不存在`));
      assert(
        await this.isProjectDomainEmpty(projectId, queryRunner),
        CustomError.new(`项目存在未删除的个性化域名配置`)
      );

      // 删除所有的工作区
      const projectEnvRepo = queryRunnerRepo(ProjectEnvRepo, queryRunner);
      await projectEnvRepo.update({ projectId: projectId, isDel: false }, { isDel: true });

      // 删除所有的项目部署记录
      const projectDeployRepo = queryRunnerRepo(ProjectEnvDeployRepo, queryRunner);
      await projectDeployRepo.update({ projectId: projectId, isDel: false }, { isDel: true });

      // 删除所有的项目成员信息
      const projectMemberRepo = queryRunnerRepo(ProjectMemberRepo, queryRunner);
      await projectMemberRepo.update({ projectId: projectId, isDel: false }, { isDel: true });

      // 删除项目信息
      const delRes = await projectRepo.update({ id: projectId, isDel: false }, { isDel: true });
      assert(delRes.affected > 0, CustomError.new(`项目删除失败`));
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 创建私人项目
   */
  private async createPersonalProject(params: IProjectCreateBody, queryRunner?: QueryRunner): Promise<Project> {
    const { id: userId } = this.ctx.loginUser;
    const projectRepo = queryRunnerRepo(ProjectRepo, queryRunner);
    const saveRes = await projectRepo.save({
      name: params.name,
      zhName: params.zhName,
      description: params.description,
      ownerId: userId,
      createUserId: userId,
    });
    return saveRes;
  }

  /**
   * 创建团队项目
   */
  private async createGroupProject(params: IProjectCreateBody, queryRunner?: QueryRunner): Promise<Project> {
    const groupRepo = queryRunnerRepo(GroupRepo, queryRunner);
    const group = await groupRepo.findOne({
      id: params.groupId,
      isDel: false,
    });
    assert(!isNil(group), CustomError.new(`当前群组 ${params.groupId} 不存在`));

    const { id: userId } = this.ctx.loginUser;
    const projectRepo = queryRunnerRepo(ProjectRepo, queryRunner);
    return await projectRepo.save({
      name: params.name,
      zhName: params.zhName,
      description: params.description,
      groupId: params.groupId,
      ownerId: userId,
      createUserId: userId,
    });
  }

  /**
   * 创建默认环境，test、beta、prod
   */
  private async createDefaultProjectEnv(projectId: number, queryRunner?: QueryRunner): Promise<void> {
    const { id: createUserId } = this.ctx.loginUser;
    const projectEnvRepo = queryRunnerRepo(ProjectEnvRepo, queryRunner);
    await projectEnvRepo.save([
      { projectId: projectId, name: "test", envType: EProjectEnvType.Test, createUserId },
      { projectId: projectId, name: "beta", envType: EProjectEnvType.Beta, createUserId },
      { projectId: projectId, name: "prod", envType: EProjectEnvType.Prod, createUserId },
    ]);
  }

  private async addProjectRole(
    projectId: number,
    options: { userId: number; role: EProjectMemberRole },
    queryRunner?: QueryRunner
  ): Promise<void> {
    const projectMemberRepo = queryRunnerRepo(ProjectMemberRepo, queryRunner);
    await projectMemberRepo.save({
      projectId: projectId,
      userId: options.userId,
      role: options.role,
    });
  }

  private async isProjectDomainEmpty(projectId: number, queryRunner?: QueryRunner): Promise<boolean> {
    const projectDomainRepo = queryRunnerRepo(ProjectDomainRepo, queryRunner);
    const existCount = await projectDomainRepo.count({
      projectId: projectId,
      isDel: false,
    });
    return existCount === 0;
  }
}
