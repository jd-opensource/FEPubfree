import { Select, Space } from "antd";
import React from "react";
import { EProjectMemberRole } from "../../../../../../interface/client-api/member.interface";

interface IProps {
  value: EProjectMemberRole;
  onChange: (value, option) => Promise<void>;
}

const RoleSelect: React.FC<IProps> = (props) => {
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
          value={EProjectMemberRole.Guest}
          key={EProjectMemberRole.Guest}
        >
          Guest
        </Select.Option>
        <Select.Option
          value={EProjectMemberRole.Developer}
          key={EProjectMemberRole.Developer}
        >
          Developer
        </Select.Option>
        <Select.Option
          value={EProjectMemberRole.Master}
          key={EProjectMemberRole.Master}
        >
          Master
        </Select.Option>
      </Select>
    </Space>
  );
};

export default RoleSelect;
