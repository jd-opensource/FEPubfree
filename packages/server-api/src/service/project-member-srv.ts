import { Inject, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as assert from "assert";
import * as _ from "lodash";
import { In } from "typeorm";
import { GroupRepo } from "../entity/group";
import { GroupMember, GroupMemberRepo } from "../entity/group-member";
import { ProjectRepo } from "../entity/project";
import { EProjectMemberRole, ProjectMember, ProjectMemberRepo } from "../entity/project-member";
import { User, UserRepo } from "../entity/user";
import { CustomError } from "../error/custom-error";
import { IProjectMemberDTO } from "../interface/project-member.interface";
import { queryRunnerRepo } from "../util/query-runner-repo";

@Provide()
export class ProjectMemberSrv {
  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  /**
   * 获取所有成员
   */
  async getProjectMembers(projectId: number): Promise<IProjectMemberDTO[]> {
    const projectRepo = queryRunnerRepo(ProjectRepo);
    const project = await projectRepo.findOne({
      id: projectId,
      isDel: false,
    });
    assert(!_.isNil(project), CustomError.new(`project with id ${project} doesn't exist.`));

    // 获取项目成员
    const projectMemberRepo = queryRunnerRepo(ProjectMemberRepo);
    const projectMembers = await projectMemberRepo.find({
      projectId: projectId,
      isDel: false,
    });

    // 获取用户身份信息
    const userIds = projectMembers.map((v) => v.userId);
    const userRepo = queryRunnerRepo(UserRepo);
    const users = await userRepo.find({ id: In(userIds), isDel: false });
    const usersMap = new Map(users.map((user) => [user.id, user]));

    return projectMembers.map((member) => {
      return {
        ...member,
        user: User.purify(usersMap.get(member.userId)),
      };
    });
  }

  /**
   * 添加项目成员
   */
  async addProjectMember(
    projectId: number,
    params: {
      name: string;
      role: EProjectMemberRole;
    }
  ): Promise<ProjectMember> {
    const { name, role } = params;
    const userRepo = queryRunnerRepo(UserRepo);
    const user = await userRepo.findOne({ name: name, isDel: false });
    assert(!_.isNil(user), CustomError.new(`用户 ${name} 不存在`));

    const projectMemberRepo = queryRunnerRepo(ProjectMemberRepo);
    const exist = await projectMemberRepo.findOne({ projectId: projectId, userId: user.id, role: role, isDel: false });
    assert(_.isNil(exist), CustomError.new(`用户 ${name} 已在成员列表中`));

    return await projectMemberRepo.save({
      projectId: projectId,
      userId: user.id,
      role: role,
    });
  }

  /**
   * 删除项目成员
   */
  async deleteProjectMember(projectId: number, memberId: number) {
    const projectMemberRepo = queryRunnerRepo(ProjectMemberRepo);
    const exist = await projectMemberRepo.findOne({ id: memberId, projectId: projectId, isDel: false });
    assert(!_.isNil(exist), CustomError.new(`未查询到匹配的项目权限记录`));

    const updateRes = await projectMemberRepo.update(
      {
        id: exist.id,
        isDel: false,
      },
      {
        isDel: true,
      }
    );
    assert(updateRes.affected > 0, `项目成员删除失败`);
  }
}
