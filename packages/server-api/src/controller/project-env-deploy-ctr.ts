import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Validate } from "@midwayjs/decorator";
import { ICreateEnvDeployBody, IProjectEnvDeployPathParams } from "../interface/project-env-deploy.interface";
import { ProjectEnvDeploySrv } from "../service/project-env-deploy-srv";
import { parseStrToNum } from "../util/parse-str-to-num";
import { WebUtil } from "./common/web-util";

@Provide()
@Controller("/api/projects/:projectId/envs/:envId/deploys", { middleware: ["AuthMiddleWare"] })
export class ProjectEnvDeployCtr {
  @Inject()
  projectEnvDeploySrv: ProjectEnvDeploySrv;

  @Get("", { description: "获取部署记录列表" })
  @Validate()
  async getDeploys(@Param(ALL) params: IProjectEnvDeployPathParams) {
    const res = await this.projectEnvDeploySrv.getEnvDeploys(parseStrToNum(params.envId));
    return WebUtil.result(res);
  }

  @Post("", { description: "创建部署记录" })
  @Validate()
  async createDeploy(@Param(ALL) params: IProjectEnvDeployPathParams, @Body(ALL) body: ICreateEnvDeployBody) {
    const deploy = await this.projectEnvDeploySrv.createEnvDeploy(
      parseStrToNum(params.projectId),
      parseStrToNum(params.envId),
      {
        type: body.type,
        options: body.options,
      }
    );
    return WebUtil.result(deploy);
  }

  @Del("/:deployId", { description: "删除部署记录" })
  @Validate()
  async deleteDeploy(@Param(ALL) params: IProjectEnvDeployPathParams) {
    await this.projectEnvDeploySrv.deleteEnvDeploy(parseStrToNum(params.deployId));
    return WebUtil.success();
  }

  @Post("/:deployId/activate", { description: "部署记录上线" })
  @Validate()
  async activateDeploy(@Param(ALL) params: IProjectEnvDeployPathParams) {
    await this.projectEnvDeploySrv.activateEnvDeploy(parseStrToNum(params.deployId));
    return WebUtil.success();
  }

  @Post("/:deployId/deactivate", { description: "部署记录下线" })
  @Validate()
  async deactivateDeploy(@Param(ALL) params: IProjectEnvDeployPathParams) {
    await this.projectEnvDeploySrv.deactivateEnvDeploy(parseStrToNum(params.deployId));
    return WebUtil.success();
  }
}
