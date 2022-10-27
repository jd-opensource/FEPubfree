import { message } from "antd";
import { observable } from "mobx";
import Api, { EApiCode } from "../../../../../api";
import { routerStore } from "../../../../../store/router-store";
import { BasicStore } from "../../../../../util/basic-store";

class Status {}

export class ProjectSettingAdvanceStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    projectId: number;
  } = null;

  async deleteProject() {
    const { projectId } = this.params;
    const res = await Api.project.deleteProject(projectId);
    if (res.code === EApiCode.Success) {
      message.success("项目删除成功");
      routerStore.push("/projects");
    } else {
      message.error(`项目删除失败，请稍候再试，${res.message}`);
    }
  }
}
