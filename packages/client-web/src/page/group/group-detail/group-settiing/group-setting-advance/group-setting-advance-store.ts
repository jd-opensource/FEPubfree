import { message } from "antd";
import { observable } from "mobx";
import Api, { EApiCode } from "../../../../../api";
import { routerStore } from "../../../../../store/router-store";
import { BasicStore } from "../../../../../util/basic-store";

class Status {}

export class GroupSettingAdvanceStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    groupId: number;
  } = null;

  async init() {}

  async destroy() {
    this.params = null;
    this.status = new Status();
  }

  async deleteGroup() {
    const { groupId } = this.params;
    const res = await Api.group.deleteGroup(groupId);
    if (res.code === EApiCode.Success) {
      message.success("空间删除成功");
      routerStore.push("/groups");
    } else {
      message.error("空间删除失败，请稍候再试");
    }
  }
}
