import { Rule } from "@midwayjs/decorator";
import { RuleType } from "@midwayjs/decorator/dist/annotation/rule";
import { EDeployTargetType, ProjectEnvDeploy } from "../entity/project-env-deploy";
import { User } from "../entity/user";

export class IProjectEnvDeployPathParams {
  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .required()
  )
  projectId: string;

  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .required()
  )
  envId?: string;

  @Rule(RuleType.string().pattern(/^[0-9]+$/))
  deployId?: string;
}

export interface IProjectEnvDeployDTO extends ProjectEnvDeploy {
  createUser: Partial<User>;

  actionUser: Partial<User>;
}

export interface ICreateEnvDeployBody {
  type: "url" | "zip";
  options: IUrlCreateDTO | IZipCreateDTO;
}

export interface IUrlCreateDTO {
  target: string;

  remark: string;
}

export interface IZipCreateDTO {}
