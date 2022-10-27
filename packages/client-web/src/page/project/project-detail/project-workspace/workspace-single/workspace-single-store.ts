import { message } from "antd";
import { isNil } from "lodash-es";
import { observable, toJS } from "mobx";
import Api, { EApiCode } from "../../../../../api";
import {
  IProjectDeployDTO,
  IProjectEnvDTO,
} from "../../../../../interface/client-api/project.interface";
import { BasicStore } from "../../../../../util/basic-store";
import { getQuery } from "../../../../../util/get-query";

interface IParams {
  projectId: number;
  workspaceId: number;
}

class Status {
  isLoading: boolean = true;

  // 当前环境, props 注入
  env: IProjectEnvDTO = null;
  curActiveTab: "info" | "deploy" | "build" | "gray" | string = "info";

  // 部署记录
  deploys: IProjectDeployDTO[] = [];
  isLoadingDeploys: boolean = false;

  isShowCreateDeployUrl: boolean = false;
  isShowCreateDeployFile: boolean = false;
}

export class WorkspaceSingleStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: IParams = null;

  async init() {
    try {
      const workspaceTab = getQuery("workspace_tab");
      if (!isNil(workspaceTab)) {
        this.setStatus({ curActiveTab: workspaceTab });
      }

      await this.fetchDeployList();
    } finally {
      this.setStatus({
        isLoading: false,
      });
    }
  }

  async destroy() {
    this.status = new Status();
    this.params = null;
  }

  get curActiveDeploy(): IProjectDeployDTO {
    const { deploys } = toJS(this.status);
    return deploys.find((v) => v.isActive === true);
  }

  async fetchDeployList() {
    const { projectId, workspaceId } = this.params;
    this.setStatus({ isLoadingDeploys: true });
    try {
      const res = await Api.project.getProjectDeploys(projectId, workspaceId);
      if (res.code === EApiCode.Success) {
        this.setStatus({
          deploys: res.data,
        });
      }
    } finally {
      this.setStatus({ isLoadingDeploys: false });
    }
  }

  async handleCreateDeployUrl(target: string, remark: string) {
    const { projectId, workspaceId } = this.params;
    const createDeployRes = await Api.project.createProjectDeploy(
      projectId,
      workspaceId,
      {
        type: "url",
        options: {
          target: target,
          remark: remark,
        },
      }
    );
    if (createDeployRes.code === EApiCode.Success) {
      this.setStatus({ isShowCreateDeployUrl: false });
      await this.fetchDeployList();
    } else {
      message.error(`新增发布失败：${createDeployRes.message}`);
    }
  }

  async handleCreateDeployFile(file: any) {
    message.warn("待实现");

    // const { projectId, workspaceId } = this.params
    // const res = await ApiV2.workspace.createDeployByUpload(
    //   projectId,
    //   workspaceId,
    //   file,
    // )
    // if (res.code === EApiCode.Success) {
    //   this.setStatus({
    //     isShowCreateDeployFile: false,
    //   })
    //   await this.fetchDeployList()
    // } else {
    //   message.error(`上传失败：${res.message}`)
    // }
  }

  async confirmActivateDeploy(deployId: number) {
    const { projectId, workspaceId: envId } = this.params;
    const res = await Api.project.activateDeploy(projectId, envId, deployId);
    if (res.code === EApiCode.Success) {
      message.success("上线成功");
      await this.fetchDeployList();
    } else {
      message.error(`上线失败，请稍候再试：${res.message}`);
    }
  }

  async confirmDeactivateDeploy(deployId: number) {
    const { projectId, workspaceId: envId } = this.params;
    const res = await Api.project.deactivateDeploy(projectId, envId, deployId);
    if (res.code === EApiCode.Success) {
      message.success("下线成功");
      await this.fetchDeployList();
    } else {
      message.error(`下线失败，请稍候再试：${res.message}`);
    }
  }
}
