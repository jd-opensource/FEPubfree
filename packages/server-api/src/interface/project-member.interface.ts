import { Rule } from "@midwayjs/decorator";
import { RuleType } from "@midwayjs/decorator/dist/annotation/rule";
import { EProjectMemberRole, ProjectMember } from "../entity/project-member";
import { User } from "../entity/user";

export interface IProjectMemberDTO extends ProjectMember {
  user: Partial<User>;
}

export class IProjectMemberCreateBody {
  @Rule(
    RuleType.string()
      .pattern(/^[a-zA-Z0-9-]+$/)
      .max(128)
      .required()
  )
  name: string;

  @Rule(
    RuleType.number()
      .valid(EProjectMemberRole.Guest, EProjectMemberRole.Developer, EProjectMemberRole.Master)
      .required()
  )
  role: EProjectMemberRole;
}

export class IProjectMemberPathParams {
  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .required()
  )
  projectId: string;

  @Rule(RuleType.string().pattern(/^[0-9]+$/))
  memberId: string;
}
