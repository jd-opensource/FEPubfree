import { message } from "antd";
import { observable } from "mobx";
import Api, { EApiCode } from "../../../../api";
import {
  EProjectEnvType,
  IProjectEnvDTO,
} from "../../../../interface/client-api/project.interface";
import { routerStore } from "../../../../store/router-store";
import { BasicStore } from "../../../../util/basic-store";

interface IParams {
  projectId: number;
  workspaceId: number;
}

class Status {
  envAreas: IProjectEnvDTO[] = [];

  curEnvAreaId: number = null;
  isShowCreateModal: boolean = false;
}

export class ProjectWorkspaceStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: IParams = null;

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  configParams(params: IParams) {
    this.params = params;
    this.setStatus({
      curEnvAreaId: params.workspaceId,
    });
  }

  async fetchEnvAreas() {
    const { projectId } = this.params;
    const envAreasRes = await Api.project.getProjectEnvs(projectId);
    if (envAreasRes.code === EApiCode.Success) {
      const envAreas = envAreasRes.data.sort((a, b) => a.envType - b.envType);
      this.setStatus({
        envAreas: envAreas,
      });
    }
  }

  switchEnvArea(envAreaIdStr: string) {
    const { projectId } = this.params;
    routerStore.replace(`/projects/${projectId}/workspaces/${envAreaIdStr}`);
  }

  async createWorkspace(envType: EProjectEnvType, name: string) {
    const { projectId } = this.params;
    const res = await Api.project.createProjectEnv(projectId, {
      name: name,
      type: envType,
    });
    if (res.code === EApiCode.Success) {
      this.setStatus({
        isShowCreateModal: false,
      });
      message.success("新建工作区成功");
      await this.fetchEnvAreas();
    } else {
      message.error(`新建工作区失败，请稍候再试: ${res.message}`);
    }
  }
}

const projectWorkspaceStore = new ProjectWorkspaceStore();
export default projectWorkspaceStore;
