import {
  Avatar,
  Button,
  Card,
  Input,
  List,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  EGroupMemberRole,
  IGroupMemberDTO,
} from "../../../../../interface/client-api/member.interface";
import GroupRoleSelect from "./group-role-select/group-role-select";
import { GroupSettingMemberStore } from "./group-setting-member-store";

const GroupSettingMember: React.FC = observer(() => {
  const storeRef = useRef(new GroupSettingMemberStore());
  const { groupId } = useParams() as { groupId: string };

  useEffect(() => {
    storeRef.current.params = {
      groupId: +groupId,
    };

    storeRef.current.init();
  }, []);

  const store = storeRef.current;
  const status = toJS(storeRef.current.status);

  if (status.isLoading) {
    return null;
  }

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
        <GroupRoleSelect
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
            await store.addGroupMember();
          }}
        >
          添加
        </Button>
      </Space>
      <Table<IGroupMemberDTO>
        size={"small"}
        style={{ marginTop: 20 }}
        rowKey="id"
        dataSource={status.members}
        columns={[
          {
            title: "成员",
            render: (value, row) => {
              return (
                <List.Item.Meta
                  avatar={
                    <Avatar
                      className="members-list-avatar"
                      shape="square"
                      size="large"
                    >
                      {row.user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={`${row.user.name}`}
                />
              );
            },
          },
          {
            title: "权限",
            dataIndex: "role",
            width: 200,
            render: (value) => {
              return <div>{EGroupMemberRole[value]}</div>;
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
                    onConfirm={() => store.deleteGroupMember(object.id)}
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

export default GroupSettingMember;
