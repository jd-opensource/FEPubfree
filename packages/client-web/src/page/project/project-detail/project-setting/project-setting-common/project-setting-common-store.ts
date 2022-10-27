import { message } from "antd";
import { observable } from "mobx";
import Api from "../../../../../api";
import { IProjectDTO } from "../../../../../interface/client-api/project.interface";
import { BasicStore } from "../../../../../util/basic-store";
import projectLayoutStore from "../../project-layout-store";

class Status {
  project: IProjectDTO = null;

  description: string = "";
  isAllowOuterHostnameVisit: boolean = null;
  supportPublicPath: boolean = null;
}

export class ProjectSettingCommonStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    projectId: number;
  } = null;

  async init() {
    await this.fetchProjectInfo();
  }

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  async fetchProjectInfo() {
    const { projectId } = this.params;
    const res = await Api.project.getProjectInfo(projectId);
    const projectInfo = res.data;
    this.setStatus({
      project: projectInfo,
      description: projectInfo.description,
      isAllowOuterHostnameVisit: false,
      supportPublicPath: false,
    });
  }

  async updateProjectDescription() {
    message.warn("功能待实现");
    // TODO
    // const { projectId } = this.params
    // const res = await ApiV2.project.updateProjectInfo(projectId, {
    //   description: this.status.description,
    // })
    // if (res.code === EApiCode.Success) {
    //   message.success('项目描述更新成功')
    //   await this.refreshProjectLayout()
    // } else {
    //   message.error('项目描述更新失败，请稍候再试')
    // }
  }

  private async refreshProjectLayout() {
    await projectLayoutStore.fetchProjectInfo();
  }
}
