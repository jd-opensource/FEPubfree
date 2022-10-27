import { observable } from "mobx";
import Api, { EApiCode } from "../../../api";
import { IProjectDTO } from "../../../interface/client-api/project.interface";
import { routerStore } from "../../../store/router-store";
import { BasicStore } from "../../../util/basic-store";

class Status {
  isLoading: boolean = true;
  curActiveKey: "workspaces" | "settings" | string = null;

  project: IProjectDTO = null;
}

export class ProjectLayoutStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    projectId: number;
  } = null;

  async init() {
    try {
      await this.fetchProjectInfo();
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  async fetchProjectInfo() {
    const { projectId } = this.params;
    const res = await Api.project.getProjectInfo(projectId);
    if (res.code === EApiCode.Success) {
      this.setStatus({
        project: res.data,
      });
    }
  }

  switchProjectTab(key: "workspaces" | "settings" | string) {
    const { projectId } = this.params;
    this.setStatus({ curActiveKey: key });

    switch (key) {
      case "workspaces":
        routerStore.replace(`/projects/${projectId}/workspaces`);
        break;
      case "settings":
        routerStore.replace(`/projects/${projectId}/settings/common`);
        break;
    }
  }
}

const projectLayoutStore = new ProjectLayoutStore();
export default projectLayoutStore;
