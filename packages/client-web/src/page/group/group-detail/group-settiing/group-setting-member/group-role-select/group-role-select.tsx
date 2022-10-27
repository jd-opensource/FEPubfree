import { Select, Space } from "antd";
import React from "react";
import { EGroupMemberRole } from "../../../../../../interface/client-api/member.interface";

interface IProps {
  value: EGroupMemberRole;
  onChange: (value, option) => Promise<void>;
}

const GroupRoleSelect: React.FC<IProps> = (props) => {
  return (
    <Space>
      <Select
        style={{ minWidth: "110px" }}
        value={props.value}
        placeholder="选择成员角色"
        onChange={async (value, option) => {
          await props.onChange(value, option);
        }}
      >
        <Select.Option
          value={EGroupMemberRole.Guest}
          key={EGroupMemberRole.Guest}
        >
          Guest
        </Select.Option>
        <Select.Option
          value={EGroupMemberRole.Developer}
          key={EGroupMemberRole.Developer}
        >
          Developer
        </Select.Option>
        <Select.Option
          value={EGroupMemberRole.Master}
          key={EGroupMemberRole.Master}
        >
          Master
        </Select.Option>
      </Select>
    </Space>
  );
};

export default GroupRoleSelect;
