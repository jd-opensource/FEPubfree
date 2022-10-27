import { Inject, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as assert from "assert";
import * as _ from "lodash";
import { In } from "typeorm";
import { EProjectEnvType, ProjectEnv, ProjectEnvRepo } from "../entity/project-env";
import { User, UserRepo } from "../entity/user";
import { CustomError } from "../error/custom-error";
import { IProjectEnvDTO } from "../interface/project-env.interface";
import { queryRunnerRepo } from "../util/query-runner-repo";

@Provide()
export class ProjectEnvSrv {
  @Inject()
  private ctx: Context;

  @Inject()
  private logger: ILogger;

  async getProjectEnvs(projectId: number): Promise<IProjectEnvDTO[]> {
    const projectEnvRepo = queryRunnerRepo(ProjectEnvRepo);
    const projectEnvs = await projectEnvRepo.find({
      projectId: projectId,
      isDel: false,
    });

    const userRepo = queryRunnerRepo(UserRepo);
    const users = await userRepo.find({ id: In(projectEnvs.map((v) => v.createUserId)) });
    const usersMap = new Map(users.map((user) => [user.id, user]));

    return projectEnvs.map((projectEnv) => {
      return {
        ...projectEnv,
        createUser: User.purify(usersMap.get(projectEnv.createUserId)),
      };
    });
  }

  /**
   * 创建项目环境
   */
  async createProjectEnv(
    projectId: number,
    params: {
      name: string;
      envType: EProjectEnvType;
    }
  ): Promise<ProjectEnv> {
    const { id: userId } = this.ctx.loginUser;

    const projectEnvRepo = queryRunnerRepo(ProjectEnvRepo);
    const existed = await projectEnvRepo.findOne({
      projectId: projectId,
      name: params.name,
    });
    assert(_.isNil(existed), CustomError.new(`当前环境 ${params.name} 已存在`));

    const saveRes = await projectEnvRepo.save({
      projectId: projectId,
      name: params.name,
      envType: params.envType,
      createUserId: userId,
    });
    return saveRes;
  }

  /**
   * 删除项目环境
   */
  async deleteProjectEnv(envId: number): Promise<void> {
    const projectEnvRepo = queryRunnerRepo(ProjectEnvRepo);
    const existed = await projectEnvRepo.findOne({
      id: envId,
      isDel: false,
    });
    assert(!_.isNil(existed), CustomError.new(`当前环境 ${envId} 不存在`));

    const updateRes = await projectEnvRepo.update(
      {
        id: envId,
        isDel: false,
      },
      {
        isDel: true,
      }
    );

    assert(updateRes.affected > 0, "环境删除失败");
  }
}
