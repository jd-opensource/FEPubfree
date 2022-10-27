import { observable, toJS } from "mobx";
import Api, { EApiCode } from "../../../../api";
import { IProjectDTO } from "../../../../interface/client-api/project.interface";
import { BasicStore } from "../../../../util/basic-store";

class Status {
  isLoading: boolean = true;

  projects: IProjectDTO[] = [];
  searchWord: string = "";
  curPage: number = 1;

  isShowCreateProjectModal: boolean = false;
}

export class GroupProjectStore extends BasicStore<Status> {
  @observable.ref status = new Status();

  params: {
    groupId: number;
  } = null;

  async init() {
    try {
      await this.fetchProjectList();
    } finally {
      this.setStatus({ isLoading: false });
    }
  }

  destroy() {
    this.status = new Status();
    this.params = null;
  }

  async fetchProjectList() {
    const { groupId } = this.params;
    const res = await Api.group.getGroupProjects(groupId);
    if (res.code === EApiCode.Success) {
      this.setStatus({ projects: res.data });
    }
  }

  get filteredProjects() {
    const { projects, searchWord } = toJS(this.status);
    return projects.filter((project) => project.name.includes(searchWord));
  }
}
