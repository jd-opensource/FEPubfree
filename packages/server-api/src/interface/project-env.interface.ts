import { Rule } from "@midwayjs/decorator";
import { RuleType } from "@midwayjs/decorator/dist/annotation/rule";
import { EProjectEnvType, ProjectEnv } from "../entity/project-env";
import { User } from "../entity/user";

export interface IProjectEnvDTO extends ProjectEnv {
  createUser: Partial<User>;
}

export class IProjectEnvPathParams {
  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .required()
  )
  projectId: string;

  @Rule(RuleType.string().pattern(/^[0-9]+$/))
  envId?: string;
}

export class IProjectEnvCreateBody {
  @Rule(
    RuleType.string()
      .pattern(/^[a-z0-9]+$/)
      .max(32)
      .required()
  )
  name: string;

  @Rule(RuleType.allow(EProjectEnvType.Test, EProjectEnvType.Gray).required())
  type: EProjectEnvType;
}
