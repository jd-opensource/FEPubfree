import { ALL, Body, Controller, Del, Get, Inject, Param, Post, Provide, Validate } from "@midwayjs/decorator";
import { GroupPathParams, IGroupCreateBody, IGroupMemberCreateBody } from "../interface/group.interface";
import { GroupMemberSrv } from "../service/group-member-srv";
import { GroupSrv } from "../service/group-srv";
import { parseStrToNum } from "../util/parse-str-to-num";
import { WebUtil } from "./common/web-util";

@Provide()
@Controller("/api/groups", { middleware: ["AuthMiddleWare"] })
export class GroupCtr {
  @Inject()
  groupSrv: GroupSrv;

  @Inject()
  groupMemberSrv: GroupMemberSrv;

  @Get("", { description: "获取空间列表" })
  @Validate()
  async getGroups() {
    const res = await this.groupSrv.getGroups();
    return WebUtil.result(res);
  }

  @Get("/:groupId", { description: "获取空间详情" })
  @Validate()
  async getGroupDetail(@Param(ALL) params: GroupPathParams) {
    const group = await this.groupSrv.getGroupDetail(parseStrToNum(params.groupId));
    return WebUtil.result(group);
  }

  @Post("", { description: "创建空间" })
  @Validate()
  async createGroup(@Body(ALL) params: IGroupCreateBody) {
    const group = await this.groupSrv.createGroup({
      name: params.name,
      description: params.description,
    });
    return WebUtil.result(group);
  }

  @Post("/:groupId", { description: "更新空间" })
  @Validate()
  async updateGroup() {
    return WebUtil.notImplemented();
  }

  @Del("/:groupId", { description: "删除空间" })
  @Validate()
  async deleteGroup(@Param(ALL) params: GroupPathParams) {
    await this.groupSrv.deleteGroup(parseStrToNum(params.groupId));
    return WebUtil.success();
  }

  @Get("/:groupId/projects", { description: "获取某个群组下的所有项目" })
  @Validate()
  async getGroupProjects(@Param(ALL) params: GroupPathParams) {
    const projects = await this.groupSrv.getGroupProjects(parseStrToNum(params.groupId));
    return WebUtil.result(projects);
  }

  @Get("/:groupId/members", { description: "获取空间成员列表" })
  @Validate()
  async getGroupMembers(@Param(ALL) params: GroupPathParams) {
    const groupMembers = await this.groupMemberSrv.getAllMembers(parseStrToNum(params.groupId));
    return WebUtil.result(groupMembers);
  }

  @Post("/:groupId/members", { description: "空间添加成员" })
  @Validate()
  async addGroupMember(@Param(ALL) params: GroupPathParams, @Body(ALL) body: IGroupMemberCreateBody) {
    const result = await this.groupMemberSrv.addGroupMember(parseStrToNum(params.groupId), {
      name: body.name,
      role: body.role,
    });
    return WebUtil.result(result);
  }

  @Del("/:groupId/members/:memberId", { description: "空间删除成员" })
  @Validate()
  async deleteGroupMember(@Param(ALL) params: GroupPathParams) {
    await this.groupMemberSrv.deleteGroupMember(parseStrToNum(params.groupId), parseStrToNum(params.memberId));
    return WebUtil.success();
  }
}
