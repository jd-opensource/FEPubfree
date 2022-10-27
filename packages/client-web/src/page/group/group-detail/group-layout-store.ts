import { observable } from "mobx";
import Api, { EApiCode } from "../../../api";
import { IGroupDTO } from "../../../interface/client-api/group.interface";
import { routerStore } from "../../../store/router-store";
import { BasicStore } from "../../../util/basic-store";

class Status {
  isLoading: boolean = true;
  curActiveKey: "projects" | "settings" | string = null;

  group: IGroupDTO = null;
}

export class GroupLayoutStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    groupId: number;
  } = null;

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
    const { groupId } = this.params;
    const res = await Api.group.getGroupDetail(groupId);
    if (res.code === EApiCode.Success) {
      this.setStatus({ group: res.data });
    }
  }

  switchGroupTab(key: "projects" | "settings" | string) {
    const { groupId } = this.params;
    this.setStatus({ curActiveKey: key });

    switch (key) {
      case "projects":
        routerStore.push(`/groups/${groupId}/projects`);
        break;
      case "settings":
        routerStore.push(`/groups/${groupId}/settings/common`);
        break;
    }
  }
}

const groupLayoutStore = new GroupLayoutStore();
export default groupLayoutStore;
