import { observable } from "mobx";
import { routerStore } from "../../../../store/router-store";
import { BasicStore } from "../../../../util/basic-store";

export enum ESettingType {
  Common = "common",
  Members = "members",
  Domain = "domain",
  Webhooks = "webhooks",
  Advance = "advance",
}

interface IParams {
  projectId: number;
  type: ESettingType;
}

class Status {
  curActiveType: ESettingType = null;
}

export class ProjectSettingStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: IParams = null;

  async init() {
    this.setStatus({ curActiveType: this.params.type });
    this.switchSettingType(this.params.type || ESettingType.Common);
  }

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  switchSettingType(key: ESettingType) {
    const { projectId } = this.params;

    this.setStatus({ curActiveType: key });

    routerStore.push(`/projects/${projectId}/settings/${key}`);
  }
}
