import { ReloadOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Spin } from "antd";
import { isNil } from "lodash-es";
import { toJS } from "mobx";
import React, { useMemo } from "react";
import {
  EProjectEnvType,
  IProjectEnvDTO,
} from "../../../../../../interface/client-api/project.interface";
import projectLayoutStore from "../../../project-layout-store";
import DeployInfoDescriptions from "../deploy-info-descriptions/deploy-info-descriptions";
import { WorkspaceSingleStore } from "../workspace-single-store";

interface IProps {
  store: WorkspaceSingleStore;
  envAreas: IProjectEnvDTO[];
}

const TabsDeployInfo: React.FC<IProps> = (props) => {
  const { store, envAreas } = props;
  const { curActiveDeploy } = store;

  const status = toJS(store.status);

  const {
    status: { project },
  } = projectLayoutStore;

  if (isNil(curActiveDeploy)) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <>
      <Space>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          loading={status.isLoadingDeploys}
          onClick={async () => {
            await store.fetchDeployList();
          }}
        />
      </Space>
      <div style={{ marginTop: 20 }}>
        <Spin spinning={status.isLoadingDeploys}>
          <DeployInfoDescriptions
            project={project}
            env={status.env}
            deploy={curActiveDeploy}
          />
        </Spin>
      </div>
    </>
  );
};

export default TabsDeployInfo;
