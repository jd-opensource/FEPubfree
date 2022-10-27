import { Context } from "@midwayjs/core";
import { Inject, Provide } from "@midwayjs/decorator";
import { ILogger } from "@midwayjs/logger";
import * as assert from "assert";
import * as _ from "lodash";
import { isNil } from "lodash";
import { In } from "typeorm";
import { EGroupMemberRole, GroupMember, GroupMemberRepo } from "../entity/group-member";
import { User, UserRepo } from "../entity/user";
import { CustomError } from "../error/custom-error";
import { IGroupMemberDTO } from "../interface/group.interface";
import { queryRunnerRepo } from "../util/query-runner-repo";

@Provide()
export class GroupMemberSrv {
  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  async getAllMembers(groupId: number): Promise<IGroupMemberDTO[]> {
    const groupMemberRepo = queryRunnerRepo(GroupMemberRepo);
    const groupMembers = await groupMemberRepo.find({
      groupId: groupId,
      isDel: false,
    });

    const userIds = groupMembers.map((member) => member.userId);
    const userRepo = queryRunnerRepo(UserRepo);
    const users = await userRepo.find({
      id: In(userIds),
      isDel: false,
    });
    const usersMap = new Map(users.map((user) => [user.id, user]));

    return groupMembers.map((member) => {
      return {
        ...member,
        user: User.purify(usersMap.get(member.userId)),
      };
    });
  }

  async addGroupMember(
    groupId: number,
    params: {
      name: string;
      role: EGroupMemberRole;
    }
  ): Promise<GroupMember> {
    const { name, role } = params;
    const userRepo = queryRunnerRepo(UserRepo);
    const user = await userRepo.findOne({ name: name, isDel: false });
    assert(!isNil(user), CustomError.new(`用户 ${name} 不存在`));

    const groupMemberRepo = queryRunnerRepo(GroupMemberRepo);
    const exist = await groupMemberRepo.findOne({ groupId: groupId, userId: user.id, role: role, isDel: false });
    assert(_.isNil(exist), CustomError.new(`用户 ${name} 已在成员列表中`));

    const groupMember = await groupMemberRepo.save({
      groupId: groupId,
      userId: user.id,
      role: role,
    });
    return groupMember;
  }

  async deleteGroupMember(groupId: number, memberId: number) {
    const groupMemberRepo = queryRunnerRepo(GroupMemberRepo);
    const exist = await groupMemberRepo.findOne({
      id: memberId,
      groupId: groupId,
      isDel: false,
    });
    assert(!_.isNil(exist), CustomError.new(`群组中未找到该成员`));

    const updateRes = await groupMemberRepo.update(
      {
        id: exist.id,
        isDel: false,
      },
      {
        isDel: true,
      }
    );
    assert(updateRes.affected > 0, CustomError.new("群组成员移除失败"));
  }
}
