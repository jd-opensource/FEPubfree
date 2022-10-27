import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { IDomainDTO } from "../../../../../interface/client-api/domain.interface";
import { timeFormat } from "../../../../../util/time-format";
import CreateDomainModal from "./create-domain-modal/create-domain-modal";
import { ProjectSettingDomainStore } from "./project-setting-domain-store";

interface IProps {}

const ProjectSettingDomain: React.FC<IProps> = observer((props) => {
  const storeRef = useRef(new ProjectSettingDomainStore());
  const { projectId } = useParams() as { projectId: string };

  useEffect(() => {
    storeRef.current.params = {
      projectId: +projectId,
    };
  }, [projectId]);

  useEffect(() => {
    storeRef.current.init();

    return () => {
      storeRef.current.destroy();
    };
  }, []);

  const store = storeRef.current;
  const status = toJS(storeRef.current.status);
  const { isLoading, domains, envs } = status;

  return (
    <Card title="个性化域名" bodyStyle={{ padding: "12px 24px" }}>
      <Space style={{ flex: 1 }}>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={async () => {
            store.refreshDomains();
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            store.setStatus({
              isShowCreateDomainModal: true,
            });
          }}
        >
          新增域名映射
        </Button>
      </Space>

      <Table<IDomainDTO>
        style={{ marginTop: 20 }}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        loading={isLoading}
        dataSource={domains}
        scroll={{ x: "scroll" }}
        columns={[
          {
            title: "环境名称",
            dataIndex: "envName",
            width: 120,
            align: "center",
            fixed: "left",
            render: (value, record) => {
              return <Tag color="error">无匹配环境</Tag>;
            },
          },
          {
            title: "映射域名",
            dataIndex: "targetHost",
            width: 200,
            align: "center",
            ellipsis: {
              showTitle: false,
            },
            render: (value, record) => (
              <Tooltip placement="topLeft" title={record.host}>
                {record.host}
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
            title: "操作",
            width: 100,
            align: "center",
            fixed: "right",
            render: (value, record) => {
              return (
                <Space>
                  <Popconfirm
                    placement="top"
                    title="确认删除该个性化域名？"
                    onConfirm={async () => {
                      await store.deleteProjectDomain(record.id);
                    }}
                  >
                    <Button size="small" type="primary" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />

      {status.isShowCreateDomainModal && (
        <CreateDomainModal store={store} envs={envs} />
      )}
    </Card>
  );
});

export default ProjectSettingDomain;
