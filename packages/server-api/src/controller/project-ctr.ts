import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Query, Validate } from "@midwayjs/decorator";
import { IProjectCreateBody, IProjectGetQuery, IProjectPathParams } from "../interface/project.interface";
import { ProjectSrv } from "../service/project-srv";
import { parseStrToNum } from "../util/parse-str-to-num";
import { WebUtil } from "./common/web-util";

@Provide()
@Controller("/api/projects", { middleware: ["AuthMiddleWare"] })
export class ProjectCtr {
  @Inject()
  projectSrv: ProjectSrv;

  @Get("", { description: "获取项目列表" })
  @Validate()
  async getProjects(@Query(ALL) query: IProjectGetQuery) {
    let { type, page: pageStr, size: sizeStr } = query;
    const page = +pageStr;
    const size = +sizeStr;

    const res = await this.projectSrv.getProjects(type, {
      page: page,
      size: size,
    });
    return WebUtil.result(res);
  }

  @Get("/:projectId", { description: "查询单个项目详情" })
  async getProject(@Param(ALL) params: IProjectPathParams) {
    const res = await this.projectSrv.getProject(+params.projectId);
    return WebUtil.result(res);
  }

  @Post("", { description: "创建项目" })
  @Validate()
  async createProject(@Body(ALL) body: IProjectCreateBody) {
    const res = await this.projectSrv.createProject({
      name: body.name,
      zhName: body.zhName,
      description: body.description,
      groupId: body.groupId,
    });
    return WebUtil.result(res);
  }

  @Post("/:projectId", { description: "更新项目" })
  @Validate()
  async updateProject() {
    return WebUtil.notImplemented();
  }

  @Del("/:projectId", { description: "删除项目" })
  @Validate()
  async deleteProject(@Param(ALL) params: IProjectPathParams) {
    await this.projectSrv.deleteProject(parseStrToNum(params.projectId));
    return WebUtil.success();
  }
}
