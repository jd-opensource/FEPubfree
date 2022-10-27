import { message } from "antd";
import { isNil } from "lodash-es";
import { observable } from "mobx";
import Api, { EApiCode } from "../api";
import { BasicStore } from "../util/basic-store";

class Status {
  userinfo: { id: number; name: string } = null;
}

export class UserStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  login = async () => {
    if (isNil(this.status.userinfo)) {
      return await this.getUserInfo();
    }
  };

  getUserInfo = async () => {
    try {
      const res = await Api.account.accountInfo();
      if (res.code === EApiCode.Success) {
        this.setStatus({
          userinfo: res.data,
        });
      }
      if (res.code === EApiCode.Unauthorized) {
        // TODO
        alert("JumpToLogin");
      }
    } catch (err) {
      message.error(`校验身份信息失败，请自行排查当前网络环境或联系咚咚答疑群`);
    }
  };

  logout = async () => {
    // TODO
  };

  get isAdministrator(): boolean {
    return false;
  }
}

const userStore = new UserStore();
export default userStore;
