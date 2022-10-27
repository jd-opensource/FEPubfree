import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Validate } from "@midwayjs/decorator";
import { IProjectDomainCreateDTO, IProjectDomainPathParams } from "../interface/project-domain.interface";
import { ProjectDomainSrv } from "../service/project-domain-srv";
import { parseStrToNum } from "../util/parse-str-to-num";
import { WebUtil } from "./common/web-util";

@Provide()
@Controller("/api/projects/:projectId/domains", { middleware: ["AuthMiddleWare"] })
export class ProjectDomainCtr {
  @Inject()
  projectDomainSrv: ProjectDomainSrv;

  @Get("")
  @Validate()
  async getProjectDomains(@Param(ALL) params: IProjectDomainPathParams) {
    const domains = await this.projectDomainSrv.getProjectDomains(parseStrToNum(params.projectId));
    return WebUtil.result(domains);
  }

  @Post("")
  @Validate()
  async createProjectDomain(@Param(ALL) params: IProjectDomainPathParams, @Body(ALL) body: IProjectDomainCreateDTO) {
    const { projectId } = params;
    const domain = await this.projectDomainSrv.createProjectDomain(parseStrToNum(projectId), {
      projectEnvId: body.projectEnvId,
      host: body.host,
    });
    return WebUtil.result(domain);
  }

  @Del("/:domainId")
  @Validate()
  async deleteProjectDomain(@Param(ALL) params: IProjectDomainPathParams) {
    const { projectId, domainId } = params;
    await this.projectDomainSrv.deleteProjectDomain(parseStrToNum(projectId), parseStrToNum(domainId));
    return WebUtil.success();
  }
}
