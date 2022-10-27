import { message } from "antd";
import { observable } from "mobx";
import Api, { EApiCode } from "../../../../../api";
import { IDomainDTO } from "../../../../../interface/client-api/domain.interface";
import { IProjectEnvDTO } from "../../../../../interface/client-api/project.interface";
import { BasicStore } from "../../../../../util/basic-store";

class Status {
  isLoading: boolean = true;

  envs: IProjectEnvDTO[] = [];
  domains: IDomainDTO[] = [];

  isShowCreateDomainModal: boolean = false;
}

export class ProjectSettingDomainStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    projectId: number;
  } = null;

  async init() {
    try {
      await this.fetchEnvs();
      await this.fetchProjectDomains();
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  async refreshDomains() {
    this.setStatus({ isLoading: true });
    try {
      await this.fetchEnvs();
      await this.fetchProjectDomains();
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  /**
   * 获取工作区信息
   */
  async fetchEnvs() {
    const { projectId } = this.params;
    const envsRes = await Api.project.getProjectEnvs(projectId);

    if (envsRes.code === EApiCode.Success) {
      this.setStatus({ envs: envsRes.data });
    }
  }

  /**
   * 获取个性化域名列表
   */
  async fetchProjectDomains() {
    const { projectId } = this.params;
    const domainsRes = await Api.domain.getProjectDomains(projectId);

    if (domainsRes.code === EApiCode.Success) {
      this.setStatus({
        domains: domainsRes.data,
      });
    }
  }

  /**
   * 删除个性化域名
   * @param domainId domainId
   */
  async deleteProjectDomain(domainId: number) {
    const { projectId } = this.params;
    const res = await Api.domain.deleteProjectDomain(projectId, domainId);
    if (res.code === EApiCode.Success) {
      message.success("删除成功");
      await this.refreshDomains();
    } else {
      message.error(res.message || "删除失败");
    }
  }

  /**
   * 创建个性化域名
   */
  async createProjectDomain(params: { projectEnvId: number; host: string }) {
    const { projectEnvId, host } = params;
    const { projectId } = this.params;

    const res = await Api.domain.createProjectDomain(projectId, {
      projectEnvId,
      host,
    });
    if (res.code === EApiCode.Success) {
      message.success("添加个性化域名成功");
      this.setStatus({ isShowCreateDomainModal: false });
      await this.refreshDomains();
    } else {
      message.error(res.message || "添加个性化域名失败");
    }
  }
}
