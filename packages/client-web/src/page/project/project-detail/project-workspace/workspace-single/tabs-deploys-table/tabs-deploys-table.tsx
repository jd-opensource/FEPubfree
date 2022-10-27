import { ReloadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { IProjectDeployDTO } from "../../../../../../interface/client-api/project.interface";
import { getPreviewUrl } from "../../../../../../util/get-preview-url";
import { timeFormat } from "../../../../../../util/time-format";
import projectLayoutStore from "../../../project-layout-store";
import DeployInfoModal from "../deploy-info-modal/deploy-info-modal";
import { WorkspaceSingleStore } from "../workspace-single-store";

interface IProps {
  store: WorkspaceSingleStore;
}

const TabsDeploysTable: React.FC<IProps> = observer((props) => {
  const { store } = props;

  const [isShowDeployInfo, setIsShowDeployInfo] = useState(false);
  const [curActiveDeployId, setCurActiveDeployId] = useState(null);

  const {
    status: { project },
  } = projectLayoutStore;

  const status = toJS(store.status);
  const { env, deploys } = status;

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Space style={{ flex: 1 }}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={status.isLoadingDeploys}
            onClick={async () => {
              await store.fetchDeployList();
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              store.setStatus({
                isShowCreateDeployUrl: true,
              });
            }}
          >
            新增发布
          </Button>
          <Button
            type="primary"
            onClick={() => {
              store.setStatus({
                isShowCreateDeployFile: true,
              });
            }}
          >
            ZIP发布
          </Button>
        </Space>
      </div>
      <Table<IProjectDeployDTO>
        style={{ marginTop: 20 }}
        rowKey="id"
        loading={status.isLoadingDeploys}
        pagination={{ pageSize: 5 }}
        dataSource={deploys}
        scroll={{ x: "scroll" }}
        columns={[
          {
            title: "发布序号",
            dataIndex: "id",
            width: 100,
            align: "center",
            fixed: "left",
          },
          {
            title: "说明",
            dataIndex: "remark",
            width: 120,
            align: "center",
            ellipsis: {
              showTitle: false,
            },
            render: (value) => (
              <Tooltip placement="topLeft" title={value}>
                {value || "--"}
              </Tooltip>
            ),
          },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            width: 200,
            align: "center",
            render: (value) => timeFormat(value),
          },
          {
            title: "修改时间",
            dataIndex: "updatedAt",
            width: 200,
            align: "center",
            render: (value) => timeFormat(value),
          },
          {
            title: "创建人",
            dataIndex: "createUserErp",
            width: 140,
            align: "center",
            ellipsis: {
              showTitle: false,
            },
            render: (value) => (
              <Tooltip placement="topLeft" title={value}>
                {value}
              </Tooltip>
            ),
          },
          {
            title: "操作人",
            dataIndex: "actionUserErp",
            width: 140,
            align: "center",
            ellipsis: {
              showTitle: false,
            },
            render: (value) => (
              <Tooltip placement="topLeft" title={value}>
                {value}
              </Tooltip>
            ),
          },
          {
            title: "状态",
            dataIndex: "isActive",
            width: 80,
            align: "center",
            fixed: "right",
            render: (value) => {
              if (value === true) {
                return <Tag color="success">生效中</Tag>;
              } else {
                return <Tag color="#bfbfbf">未生效</Tag>;
              }
            },
          },
          {
            title: "操作",
            width: 200,
            align: "center",
            fixed: "right",
            render: (value, record) => {
              return (
                <Space>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      setIsShowDeployInfo(true);
                      setCurActiveDeployId(record.id);
                    }}
                  >
                    详情
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      const url = getPreviewUrl(project, env, record);
                      window.open(url, "_blank");
                    }}
                  >
                    预览
                  </Button>
                  {record.isActive === true && (
                    <Popconfirm
                      placement="top"
                      title="确认下线该资源？"
                      onConfirm={async () => {
                        await store.confirmDeactivateDeploy(record.id);
                      }}
                    >
                      <Button size="small" type="primary" danger>
                        下线
                      </Button>
                    </Popconfirm>
                  )}
                  {record.isActive === false && (
                    <Popconfirm
                      placement="top"
                      title="确认上线该资源？"
                      onConfirm={async () => {
                        await store.confirmActivateDeploy(record.id);
                      }}
                    >
                      <Button size="small" type="primary">
                        上线
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
      {isShowDeployInfo && (
        <DeployInfoModal
          project={project}
          env={env}
          deploy={deploys.find((value) => value.id === curActiveDeployId)}
          onCancel={() => setIsShowDeployInfo(false)}
        />
      )}
    </div>
  );
});

export default TabsDeploysTable;
