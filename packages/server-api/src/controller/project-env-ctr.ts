import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Validate } from "@midwayjs/decorator";
import { IProjectEnvCreateBody, IProjectEnvPathParams } from "../interface/project-env.interface";
import { ProjectEnvSrv } from "../service/project-env-srv";
import { parseStrToNum } from "../util/parse-str-to-num";
import { WebUtil } from "./common/web-util";

@Provide()
@Controller("/api/projects/:projectId/envs", { middleware: ["AuthMiddleWare"] })
export class ProjectEnvCtr {
  @Inject()
  projectEnvSrv: ProjectEnvSrv;

  @Get("", { description: "获取工作区列表" })
  @Validate()
  async getProjectEnvs(@Param(ALL) params: IProjectEnvPathParams) {
    const projectEnvs = await this.projectEnvSrv.getProjectEnvs(parseStrToNum(params.projectId));
    return WebUtil.result(projectEnvs);
  }

  @Post("", { description: "新建工作区" })
  @Validate()
  async createProjectEnv(@Param(ALL) params: IProjectEnvPathParams, @Body(ALL) body: IProjectEnvCreateBody) {
    const res = await this.projectEnvSrv.createProjectEnv(parseStrToNum(params.projectId), {
      name: body.name,
      envType: body.type,
    });
    return WebUtil.result(res);
  }

  @Post("/:envId", { description: "更新工作区信息" })
  @Validate()
  async updateProjectEnv(@Param(ALL) params: IProjectEnvPathParams) {
    return WebUtil.notImplemented();
  }

  @Del("/:envId", { description: "删除工作区" })
  @Validate()
  async deleteProjectEnv(@Param(ALL) params: IProjectEnvPathParams) {
    await this.projectEnvSrv.deleteProjectEnv(parseStrToNum(params.envId));
    return WebUtil.success();
  }
}
