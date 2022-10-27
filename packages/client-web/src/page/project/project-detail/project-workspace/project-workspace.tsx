import { PlusOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import { isEmpty } from "lodash-es";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  EProjectEnvType,
  IProjectEnvDTO,
} from "../../../../interface/client-api/project.interface";
import projectLayoutStore from "../project-layout-store";
import CreateWorkspaceModal from "./create-workspace-modal/create-workspace-modal";
import projectWorkspaceStore from "./project-workspace-store";
import styles from "./project-workspace.module.less";
import WorkspaceSingle from "./workspace-single/workspace-single";

const EnvAreaTabPaneTab = (props: { envArea: IProjectEnvDTO }) => {
  const { envArea } = props;
  return (
    <div>
      {envArea.envType === EProjectEnvType.Test && (
        <span className={styles.tabPaneTest}>测</span>
      )}
      {envArea.envType === EProjectEnvType.Beta && (
        <span className={styles.tabPaneBeta}>预</span>
      )}
      {envArea.envType === EProjectEnvType.Gray && (
        <span className={styles.tabPaneGray}>灰</span>
      )}
      {envArea.envType === EProjectEnvType.Prod && (
        <span className={styles.tabPanePro}>线</span>
      )}
      {envArea.name && <span className="env-name">{envArea.name}</span>}
    </div>
  );
};

const ProjectWorkspace: React.FC<
  RouteComponentProps<{
    projectId: string;
    workspaceId: string;
  }>
> = observer((props) => {
  const storeRef = useRef(projectWorkspaceStore);

  useEffect(() => {
    projectLayoutStore.setStatus({ curActiveKey: "workspaces" });

    return () => {
      storeRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    const { projectId, workspaceId } = props.match.params;
    storeRef.current.configParams({
      projectId: +projectId,
      workspaceId: +workspaceId,
    });
  }, [props.match.params]);

  useEffect(() => {
    storeRef.current.fetchEnvAreas();
  }, [props.match.params?.projectId]);

  const store = storeRef.current;
  const status = toJS(storeRef.current.status);

  if (isEmpty(status.envAreas)) {
    return null;
  }

  return (
    <div className={styles.projectWorkspace}>
      <Tabs
        className="project-env-area-tabs"
        type="card"
        activeKey={String(status.curEnvAreaId)}
        tabPosition="left"
        tabBarStyle={{
          width: "170px",
          textAlign: "left",
        }}
        onTabClick={(activeKey) => {
          if (activeKey === "add") {
            store.setStatus({
              isShowCreateModal: true,
            });
          } else {
            storeRef.current.switchEnvArea(activeKey);
          }
        }}
      >
        {status.envAreas.map((envArea) => (
          <Tabs.TabPane
            key={String(envArea.id)}
            tab={<EnvAreaTabPaneTab envArea={envArea} />}
          >
            <WorkspaceSingle env={envArea} />
          </Tabs.TabPane>
        ))}
        <Tabs.TabPane
          key="add"
          style={{ background: "red" }}
          tab={
            <div>
              <PlusOutlined style={{ marginRight: "6px" }} />
              <span>新建工作区</span>
            </div>
          }
        />
      </Tabs>
      {status.isShowCreateModal && <CreateWorkspaceModal store={store} />}
    </div>
  );
});

export default ProjectWorkspace;
