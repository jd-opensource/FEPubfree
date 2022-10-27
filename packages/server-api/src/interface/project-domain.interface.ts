import { Rule } from "@midwayjs/decorator";
import { RuleType } from "@midwayjs/decorator/dist/annotation/rule";

export class IProjectDomainPathParams {
  @Rule(
    RuleType.string()
      .pattern(/^[0-9]+$/)
      .required()
  )
  projectId: string;

  @Rule(RuleType.string().pattern(/^[0-9]+$/))
  domainId: string;
}

export class IProjectDomainCreateDTO {
  @Rule(RuleType.number().required())
  projectEnvId: number;

  @Rule(
    RuleType.string()
      .pattern(/^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/)
      .required()
  )
  host: string;
}
