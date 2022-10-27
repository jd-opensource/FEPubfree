import { message } from "antd";
import { isNil } from "lodash-es";
import { observable } from "mobx";
import Api, { EApiCode } from "../../../../../api";
import {
  EGroupMemberRole,
  IGroupMemberDTO,
} from "../../../../../interface/client-api/member.interface";
import { BasicStore } from "../../../../../util/basic-store";

class Status {
  isLoading: boolean = true;

  members: IGroupMemberDTO[] = [];

  preAddUsername: string = null;
  preAddUserRole: EGroupMemberRole = null;
}

export class GroupSettingMemberStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    groupId: number;
  } = null;

  async init() {
    try {
      await this.fetchGroupMembers();
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  async destroy() {}

  async fetchGroupMembers() {
    const res = await Api.member.getGroupMembers(this.params.groupId);
    if (res.code === EApiCode.Success) {
      this.setStatus({ members: res.data });
    }
  }

  async addGroupMember() {
    const { preAddUsername, preAddUserRole } = this.status;

    if (isNil(preAddUsername) || isNil(preAddUserRole)) {
      return message.warning("请先选择要添加的人员和权限");
    }

    const { groupId } = this.params;
    const res = await Api.member.addGroupMember(groupId, {
      name: preAddUsername,
      role: preAddUserRole,
    });
    if (res.code === EApiCode.Success) {
      message.success("成员添加成功");

      this.setStatus({
        preAddUsername: null,
        preAddUserRole: null,
      });
      await this.fetchGroupMembers();
    } else {
      message.error("成员添加失败，请稍候再试");
    }
  }

  async deleteGroupMember(memberId: number) {
    const { groupId } = this.params;
    const res = await Api.member.deleteGroupMember(groupId, memberId);
    if (res.code === EApiCode.Success) {
      message.success("成员移除成功");

      this.setStatus({
        preAddUsername: null,
        preAddUserRole: null,
      });
      await this.fetchGroupMembers();
    } else {
      message.error("成员移除失败，请稍候再试");
    }
  }
}
