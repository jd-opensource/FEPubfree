import { observable } from "mobx";
import { routerStore } from "../../../../store/router-store";
import { BasicStore } from "../../../../util/basic-store";

export enum ESettingType {
  Common = "common",
  Members = "members",
  Advance = "advance",
}

class Status {
  curActiveType: ESettingType = null;
}

export class GroupSettingStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    groupId: number;
    type: ESettingType;
  } = null;

  async init() {
    this.setStatus({ curActiveType: this.params.type });
    this.switchSettingType(this.params.type || ESettingType.Common);
  }

  async destroy() {
    this.setStatus({
      curActiveType: ESettingType.Common,
    });
  }

  switchSettingType(key: ESettingType) {
    const { groupId } = this.params;

    this.setStatus({ curActiveType: key });

    routerStore.push(`/groups/${groupId}/settings/${key}`);
  }
}
