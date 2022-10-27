import { Inject, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as assert from "assert";
import * as _ from "lodash";
import { isEmpty } from "lodash";
import { getConnection, In, QueryRunner } from "typeorm";
import { Group, GroupRepo } from "../entity/group";
import { EGroupMemberRole, GroupMemberRepo } from "../entity/group-member";
import { ProjectRepo } from "../entity/project";
import { User, UserRepo } from "../entity/user";
import { CustomError } from "../error/custom-error";
import { IGroupCreateBody, IGroupDTO } from "../interface/group.interface";
import { IProjectDTO } from "../interface/project.interface";
import { queryRunnerRepo } from "../util/query-runner-repo";

@Provide()
export class GroupSrv {
  @Inject()
  private ctx: Context;

  @Inject()
  private logger: ILogger;

  /**
   * 查询群组
   */
  async getGroups(): Promise<IGroupDTO[]> {
    const groupRepo = queryRunnerRepo(GroupRepo);
    const results = await groupRepo.find({
      where: {
        isDel: false,
      },
    });
    return results;
  }

  /**
   * 查询群组详情
   */
  async getGroupDetail(groupId: number) {
    const groupRepo = queryRunnerRepo(GroupRepo);
    const group = await groupRepo.findOne({
      id: groupId,
      isDel: false,
    });
    return group;
  }

  /**
   * 创建群组
   * 1、新建群组
   * 2、给当前创建者分配群组 Master 权限
   */
  async createGroup(params: IGroupCreateBody): Promise<Group> {
    const { id: userId } = this.ctx.loginUser;

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const groupRepo = queryRunnerRepo(GroupRepo, queryRunner);
      const existed = await groupRepo.findOne({
        name: params.name,
        isDel: false,
      });
      assert(_.isNil(existed), CustomError.new(`当前空间 ${params.name} 已存在`));

      const group = await groupRepo.save({
        name: params.name,
        description: params.description,
        ownerId: userId,
        createUserId: userId,
      });

      // 默认分配 Master 权限
      await this.addGroupRole(group.id, { userId: userId, role: EGroupMemberRole.Master }, queryRunner);

      await queryRunner.commitTransaction();
      return group;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除群组
   * 删除群组前，确保一下几点
   * 1、该群组下不再存在任何 project 项目
   *
   * 删除过程
   * 1、删除所有的群组成员信息
   * 2、删除群组信息
   */
  async deleteGroup(groupId: number): Promise<void> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const groupRepo = queryRunnerRepo(GroupRepo, queryRunner);
      const group = await groupRepo.findOne({ id: groupId, isDel: false });
      assert(!_.isNil(group), CustomError.new(`群组 ${groupId} 不存在`));

      // 删除群组前需确保无任何项目存在
      const projectRepo = queryRunnerRepo(ProjectRepo, queryRunner);
      const existedCount = await projectRepo.count({ groupId: groupId, isDel: false });
      assert(existedCount === 0, CustomError.new(`群组存在未删除的项目`));

      // 删除群组成员信息
      const groupMember = queryRunnerRepo(GroupMemberRepo, queryRunner);
      await groupMember.update({ groupId: groupId, isDel: false }, { isDel: true });

      // 开始删除群组
      const delRes = await groupRepo.update({ id: groupId, isDel: false }, { isDel: true });
      assert(delRes.affected > 0, CustomError.new(`群组删除失败`));
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 获取一个群组下的所有的项目
   */
  async getGroupProjects(groupId: number): Promise<IProjectDTO[]> {
    const projectRepo = queryRunnerRepo(ProjectRepo);
    const projects = await projectRepo.find({
      groupId: groupId,
      isDel: false,
    });

    if (isEmpty(projects)) {
      return [];
    }

    const createUserIds = projects.map((project) => project.createUserId);
    const usersRepo = queryRunnerRepo(UserRepo);
    const users = await usersRepo.find({
      id: In(createUserIds),
      isDel: false,
    });
    const usersMap = new Map(users.map((user) => [user.id, user]));

    return projects.map((project) => {
      return {
        ...project,
        createUser: User.purify(usersMap.get(project.createUserId)),
      } as IProjectDTO;
    });
  }

  private async addGroupRole(
    groupId: number,
    options: { userId: number; role: EGroupMemberRole },
    queryRunner?: QueryRunner
  ): Promise<void> {
    const groupRoleRepo = queryRunnerRepo(GroupMemberRepo, queryRunner);
    await groupRoleRepo.save({
      groupId: groupId,
      userId: options.userId,
      role: options.role,
    });
  }
}
