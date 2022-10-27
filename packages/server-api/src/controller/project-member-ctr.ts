import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Validate } from "@midwayjs/decorator";
import { ProjectMember } from "../entity/project-member";
import {
  IProjectMemberCreateBody,
  IProjectMemberDTO,
  IProjectMemberPathParams,
} from "../interface/project-member.interface";
import { ProjectMemberSrv } from "../service/project-member-srv";
import { parseStrToNum } from "../util/parse-str-to-num";
import { ApiResponse } from "./common/api-response";
import { WebUtil } from "./common/web-util";

@Provide()
@Controller("/api/projects/:projectId/members", { middleware: ["AuthMiddleWare"] })
export class ProjectMemberCtr {
  @Inject()
  projectMemberSrv: ProjectMemberSrv;

  @Get("", { description: "获取项目成员" })
  @Validate()
  async getProjectMembers(@Param(ALL) params: IProjectMemberPathParams): Promise<ApiResponse<IProjectMemberDTO[]>> {
    const projectMembers = await this.projectMemberSrv.getProjectMembers(parseStrToNum(params.projectId));
    return WebUtil.result(projectMembers);
  }

  @Post("", { description: "添加项目成员" })
  @Validate()
  async addProjectMembers(
    @Param(ALL) params: IProjectMemberPathParams,
    @Body(ALL) body: IProjectMemberCreateBody
  ): Promise<ApiResponse<ProjectMember>> {
    const saveRes = await this.projectMemberSrv.addProjectMember(parseStrToNum(params.projectId), {
      name: body.name,
      role: body.role,
    });
    return WebUtil.result(saveRes);
  }

  @Del("/:memberId", { description: "删除项目成员" })
  @Validate()
  async deleteProjectMember(@Param(ALL) params: IProjectMemberPathParams): Promise<ApiResponse<void>> {
    await this.projectMemberSrv.deleteProjectMember(parseStrToNum(params.projectId), parseStrToNum(params.memberId));
    return WebUtil.success();
  }
}
