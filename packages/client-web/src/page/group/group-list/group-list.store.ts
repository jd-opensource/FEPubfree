import { observable } from "mobx";
import Api, { EApiCode } from "../../../api";
import { IGroupDTO } from "../../../interface/client-api/group.interface";
import { BasicStore } from "../../../util/basic-store";

class Status {
  groups: IGroupDTO[] = null;
  isShowCreateModal: boolean = false;
}

class GroupListStore extends BasicStore<Status> {
  @observable status = new Status();

  async fetchGroupList() {
    const res = await Api.group.getGroups();

    if (res.code === EApiCode.Success) {
      this.setStatus({
        groups: res.data,
      });
    }
  }
}

const groupListStore = new GroupListStore();
export default groupListStore;
