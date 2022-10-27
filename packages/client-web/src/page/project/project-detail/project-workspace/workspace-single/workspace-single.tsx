import { Button, Card, Popover, Space } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useRef } from "react";
import QrCode from "../../../../../component/qrcode/qrcode";
import { IProjectEnvDTO } from "../../../../../interface/client-api/project.interface";
import projectWorkspaceStore from "../project-workspace-store";
import CreateDeployFile from "./create-deploy-file/create-deploy-file";
import CreateDeployUrl from "./create-deploy-url/create-deploy-url";
import TabsDeployInfo from "./tabs-deploy-info/tabs-deploy-info";
import TabsDeploysTable from "./tabs-deploys-table/tabs-deploys-table";
import { WorkspaceSingleStore } from "./workspace-single-store";

interface IProps {
  env: IProjectEnvDTO;
}

const WorkspaceSingle: React.FC<IProps> = observer((props) => {
  const { env } = props;
  const storeRef = useRef(new WorkspaceSingleStore());
  const projectWorkspaceStoreRef = useRef(projectWorkspaceStore);

  useEffect(() => {
    storeRef.current.params = {
      projectId: props.env.projectId,
      workspaceId: props.env.id,
    };

    storeRef.current.setStatus({
      env: props.env,
    });

    const curEnvAreaId = toJS(
      projectWorkspaceStoreRef.current.status.curEnvAreaId
    );

    if (props.env.id === curEnvAreaId) {
      storeRef.current.init();

      return () => {
        storeRef.current.destroy();
      };
    }
  }, [props.env, projectWorkspaceStoreRef.current.status.curEnvAreaId]);

  const envUrl = useMemo(() => {
    return "https://baidu.com";
  }, [env]);

  const store = storeRef.current;
  const status = toJS(storeRef.current.status);

  if (status.isLoading) {
    return null;
  }

  return (
    <>
      <Card
        tabList={[
          { key: "info", tab: "当前生效记录" },
          { key: "deploy", tab: "发布记录" },
        ].filter((v) => v)}
        tabBarExtraContent={
          <Space>
            <Popover placement="bottom" content={<QrCode url={envUrl} />}>
              <Button type="link" onClick={() => window.open(envUrl, "_blank")}>
                查看页面
              </Button>
            </Popover>
          </Space>
        }
        activeTabKey={status.curActiveTab}
        onTabChange={(key) => {
          store.setStatus({
            curActiveTab: key,
          });
        }}
      >
        {status.curActiveTab === "info" && (
          <TabsDeployInfo
            store={store}
            envAreas={toJS(projectWorkspaceStoreRef.current.status.envAreas)}
          />
        )}
        {status.curActiveTab === "deploy" && <TabsDeploysTable store={store} />}
        {status.isShowCreateDeployUrl && <CreateDeployUrl store={store} />}
        {status.isShowCreateDeployFile && <CreateDeployFile store={store} />}
      </Card>
    </>
  );
});

export default WorkspaceSingle;
