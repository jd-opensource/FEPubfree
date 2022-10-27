import { Rule } from "@midwayjs/decorator";
import { RuleType } from "@midwayjs/decorator/dist/annotation/rule";
import { Group } from "../entity/group";
import { EGroupMemberRole, GroupMember } from "../entity/group-member";
import { User } from "../entity/user";

export class GroupPathParams {
  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .required()
  )
  groupId: string;

  @Rule(RuleType.string().pattern(/^[0-9]+$/))
  memberId: string;
}

export class IGroupCreateBody {
  @Rule(
    RuleType.string()
      .pattern(/^[a-zA-Z0-9-]+$/)
      .max(128)
      .required()
  )
  name: string;

  @Rule(RuleType.string())
  description: string;
}

export interface IGroupDTO extends Group {}

export interface IGroupMemberDTO extends GroupMember {
  user: Partial<User>;
}

export class IGroupMemberCreateBody {
  @Rule(
    RuleType.string()
      .pattern(/^[a-zA-Z0-9-]+$/)
      .max(128)
      .required()
  )
  name: string;

  @Rule(RuleType.number().valid(EGroupMemberRole.Guest, EGroupMemberRole.Developer, EGroupMemberRole.Master).required())
  role: EGroupMemberRole;
}
