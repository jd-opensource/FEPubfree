import { message } from "antd";
import { isNil } from "lodash-es";
import { observable } from "mobx";
import Api, { EApiCode } from "../../../../../api";
import {
  EProjectMemberRole,
  IProjectMemberDTO,
} from "../../../../../interface/client-api/member.interface";
import { BasicStore } from "../../../../../util/basic-store";

class Status {
  members: IProjectMemberDTO[] = [];

  preAddUsername: string = null;
  preAddUserRole: EProjectMemberRole = null;
}

export class ProjectSettingMemberStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    projectId: number;
  } = null;

  async init() {
    await this.fetchProjectMembers();
  }

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  async fetchProjectMembers() {
    const { projectId } = this.params;
    const res = await Api.member.getProjectMembers(projectId);
    if (res.code === EApiCode.Success) {
      this.setStatus({
        members: res.data,
      });
    }
  }

  async addProjectMember() {
    const { preAddUsername, preAddUserRole } = this.status;
    if (isNil(preAddUsername) || isNil(preAddUserRole)) {
      return message.warning("请先选择要添加的人员和权限");
    }

    const { projectId } = this.params;
    const res = await Api.member.addProjectMember(projectId, {
      name: preAddUsername,
      role: preAddUserRole,
    });
    if (res.code === EApiCode.Success) {
      message.success("成员添加成功");

      this.setStatus({
        preAddUsername: null,
        preAddUserRole: null,
      });
      await this.fetchProjectMembers();
    } else {
      message.error("成员添加失败，请稍候再试");
    }
  }

  async removeProjectMember(member: IProjectMemberDTO) {
    const { projectId } = this.params;
    const res = await Api.member.deleteProjectMember(projectId, member.id);
    if (res.code === EApiCode.Success) {
      message.success("成员移除成功");

      this.setStatus({
        preAddUsername: null,
        preAddUserRole: null,
      });
      await this.fetchProjectMembers();
    } else {
      message.error("成员移除失败，请稍候再试");
    }
  }
}
