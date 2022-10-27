import { observable } from "mobx";
import Api, { EApiCode } from "../../../../../api";
import { IGroupDTO } from "../../../../../interface/client-api/group.interface";
import { BasicStore } from "../../../../../util/basic-store";

class Status {
  isLoading: boolean = true;

  group: IGroupDTO = null;
}

export class GroupSettingCommonStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: { groupId: number } = null;

  async init() {
    try {
      await this.fetchGroupInfo();
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  async fetchGroupInfo() {
    const res = await Api.group.getGroupDetail(this.params.groupId);
    if (res.code === EApiCode.Success) {
      this.setStatus({
        group: res.data,
      });
    }
  }
}
