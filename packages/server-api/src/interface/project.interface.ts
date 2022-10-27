import { Rule } from "@midwayjs/decorator";
import { RuleType } from "@midwayjs/decorator/dist/annotation/rule";
import { Project } from "../entity/project";
import { User } from "../entity/user";

export class IProjectPathParams {
  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .required()
  )
  projectId: string;
}

export class IProjectGetQuery {
  @Rule(RuleType.string().valid("self", "all").default("self"))
  type: "self" | "all";

  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .default("1")
  )
  page: string;

  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .default("20")
  )
  size: string;
}

export class IProjectDTO extends Project {
  createUser: Partial<User>;
}

export class IProjectCreateBody {
  @Rule(
    RuleType.string()
      .pattern(/^[a-z0-9-]+$/)
      .max(128)
      .required()
  )
  name: string;

  @Rule(RuleType.string().max(128).required())
  zhName: string;

  @Rule(RuleType.string())
  description: string;

  @Rule(RuleType.number())
  groupId?: number;
}
