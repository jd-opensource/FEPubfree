import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import CreateProjectModal from "../../../component/create-project-modal/create-project-modal";
import ProjectListCard from "../../../component/project-list-card/project-list-card";
import groupLayoutStore from "../group-layout-store";
import { GroupProjectStore } from "./group-project-store";

const GroupProject: React.FC<
  RouteComponentProps<{
    groupId: string;
  }>
> = observer((props) => {
  const storeRef = useRef(new GroupProjectStore());

  useEffect(() => {
    groupLayoutStore.setStatus({ curActiveKey: "projects" });
  }, []);

  useEffect(() => {
    const { groupId } = props.match.params;
    storeRef.current.params = {
      groupId: +groupId,
    };

    storeRef.current.init();

    return () => {
      storeRef.current.destroy();
    };
  }, []);

  const store = storeRef.current;
  const status = toJS(storeRef.current.status);
  const { filteredProjects } = store;
  const { isLoading } = status;

  if (isLoading) {
    return null;
  }

  return (
    <>
      <ProjectListCard
        projects={filteredProjects}
        projectsTotal={filteredProjects.length}
        curPage={status.curPage}
        onSearch={(searchVal) => {
          store.setStatus({
            searchWord: searchVal,
          });
        }}
        onPageChange={(page) => {
          store.setStatus({ curPage: page });
        }}
        onClickCreate={() => {
          store.setStatus({ isShowCreateProjectModal: true });
        }}
      />
      {status.isShowCreateProjectModal && (
        <CreateProjectModal
          groupId={+props.match.params.groupId}
          onOk={async () => {
            store.setStatus({ isShowCreateProjectModal: false });
            await store.fetchProjectList();
          }}
          onCancel={() => {
            store.setStatus({ isShowCreateProjectModal: false });
          }}
        />
      )}
    </>
  );
});

export default GroupProject;
