import { Inject, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as assert from "assert";
import { isNil } from "lodash";
import { ProjectDomain, ProjectDomainRepo } from "../entity/project-domain";
import { CustomError } from "../error/custom-error";
import { queryRunnerRepo } from "../util/query-runner-repo";

@Provide()
export class ProjectDomainSrv {
  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  async getProjectDomains(projectId: number): Promise<ProjectDomain[]> {
    const projectDomainRepo = queryRunnerRepo(ProjectDomainRepo);
    const projectDomains = await projectDomainRepo.find({
      where: {
        projectId: projectId,
        isDel: false,
      },
    });
    return projectDomains;
  }

  async createProjectDomain(projectId: number, params: { projectEnvId: number; host: string }): Promise<ProjectDomain> {
    const { projectEnvId, host } = params;
    const projectDomainRepo = queryRunnerRepo(ProjectDomainRepo);

    // 确保该域名未被用过
    const existedDomain = await projectDomainRepo.findOne({
      host: host,
      isDel: false,
    });

    assert(isNil(existedDomain), CustomError.new("当前域名已占用，请解除该域名配置或更换新域名"));

    const domain = await projectDomainRepo.save({
      projectId: projectId,
      projectEnvId: projectEnvId,
      host: host,
    });
    return domain;
  }

  async deleteProjectDomain(projectId: number, domainId: number): Promise<void> {
    const projectDomainRepo = queryRunnerRepo(ProjectDomainRepo);
    const updateRes = await projectDomainRepo.update(
      {
        id: domainId,
        isDel: false,
      },
      {
        isDel: true,
      }
    );
    assert(updateRes.affected > 0, CustomError.new("域名删除失败"));
  }
}
