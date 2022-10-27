import { Button, Card, Input, Popconfirm, Space, Table } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  EProjectMemberRole,
  IProjectMemberDTO,
} from "../../../../../interface/client-api/member.interface";
import { ProjectSettingMemberStore } from "./project-setting-member-store";
import RoleSelect from "./role-select/role-select";

interface IProps {}

const ProjectSettingMember: React.FC<IProps> = observer((props) => {
  const storeRef = useRef(new ProjectSettingMemberStore());
  const { projectId } = useParams() as { projectId: string };

  useEffect(() => {
    storeRef.current.params = {
      projectId: +projectId,
    };
    storeRef.current.init();

    return () => {
      storeRef.current.destroy();
    };
  }, []);

  const store = storeRef.current;
  const status = toJS(storeRef.current.status);

  return (
    <Card title="成员管理" bodyStyle={{ padding: "12px 24px" }}>
      <Space>
        <Input
          value={status.preAddUsername}
          placeholder="输入成员名称"
          onChange={(event) => {
            store.setStatus({
              preAddUsername: event.target.value,
            });
          }}
        />
        <RoleSelect
          value={status.preAddUserRole}
          onChange={async (value, option) => {
            store.setStatus({
              preAddUserRole: value,
            });
          }}
        />
        <Button
          type="primary"
          onClick={async () => {
            await store.addProjectMember();
          }}
        >
          添加
        </Button>
      </Space>
      <Table<IProjectMemberDTO>
        size={"small"}
        style={{ marginTop: 20 }}
        rowKey={(record) => record.user.id}
        dataSource={status.members}
        columns={[
          {
            title: "成员",
            render: (value, object) => {
              return <div>{object.user.name}</div>;
            },
          },
          {
            title: "项目权限",
            dataIndex: "role",
            width: 200,
            render: (value, object) => {
              return <div>{EProjectMemberRole[object.role]}</div>;
            },
          },
          {
            title: "操作",
            width: 200,
            align: "center",
            render: (value, object) => {
              return (
                <Space>
                  <Popconfirm
                    title={`确认移除成员？`}
                    onConfirm={() => store.removeProjectMember(object)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button size="small" type="primary" danger>
                      移除
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
    </Card>
  );
});

export default ProjectSettingMember;
