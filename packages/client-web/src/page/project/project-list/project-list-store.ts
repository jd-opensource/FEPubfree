import { observable, toJS } from "mobx";
import Api, { EApiCode } from "../../../api";
import { IProjectDTO } from "../../../interface/client-api/project.interface";
import { routerStore } from "../../../store/router-store";
import { BasicStore } from "../../../util/basic-store";
import { getQuery } from "../../../util/get-query";

class Status {
  isLoading: boolean = true;

  curActiveTab: "my" | "all" | string = "my";

  mySearchWord: string = null;
  myIsLoading: boolean = false;
  myCurPage: number = 1;
  myProjects: IProjectDTO[] = [];
  myProjectsTotal: number = null;

  allSearchWord: string = null;
  allIsLoading: boolean = false;
  allCurPage: number = 1;
  allProjects: IProjectDTO[] = [];
  allProjectsTotal: number = null;

  isShowCreateProjectModal: boolean = false;
}

export class ProjectListStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  async init() {
    try {
      this.checkActiveTabQuery();
      await this.fetchProjects();
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  destroy() {
    this.status = new Status();
  }

  checkActiveTabQuery() {
    const activeTab = getQuery("active_tab");
    switch (activeTab) {
      case "my":
        this.setStatus({ curActiveTab: "my" });
        break;
      case "all":
        this.setStatus({ curActiveTab: "all" });
        break;
      default:
        this.setStatus({ curActiveTab: "my" });
        break;
    }
  }

  async fetchProjects() {
    const { curActiveTab } = this.status;
    this.setStatus({ isLoading: true });

    try {
      switch (curActiveTab) {
        case "my":
          return await this.fetchMimeProjects();
        case "all":
          return await this.fetchAllProjects();
        default:
          return;
      }
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  async fetchMimeProjects() {
    const { mySearchWord, myCurPage } = toJS(this.status);

    try {
      this.setStatus({ myIsLoading: true });
      const res = await Api.project.getProjects({
        type: "self",
        page: myCurPage,
        size: 10,
      });

      if (res.code === EApiCode.Success) {
        const { projects, total } = res.data;
        this.setStatus({
          myProjects: projects,
          myProjectsTotal: total,
        });
      } else {
        return Promise.reject(res.message);
      }
    } finally {
      this.setStatus({ myIsLoading: false });
    }
  }

  async fetchAllProjects() {
    const { allSearchWord, allCurPage } = toJS(this.status);

    try {
      this.setStatus({ allIsLoading: true });
      const res = await Api.project.getProjects({
        type: "all",
        page: allCurPage,
        size: 10,
      });
      if (res.code === EApiCode.Success) {
        const { projects, total } = res.data;
        this.setStatus({
          allProjects: projects,
          allProjectsTotal: total,
        });
      } else {
        return Promise.reject(res.message);
      }
    } finally {
      this.setStatus({ allIsLoading: false });
    }
  }

  async onCardTabChange(key: "my" | "all" | string) {
    routerStore.replace(`/projects?active_tab=${key}`);

    this.setStatus({ curActiveTab: key });
    await this.fetchProjects();
  }

  onClickCreateProjectButton() {
    this.setStatus({ isShowCreateProjectModal: true });
  }
}
