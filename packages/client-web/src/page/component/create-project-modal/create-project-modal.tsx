import { Form, Input, message, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { isNil } from "lodash-es";
import React, { useCallback } from "react";
import Api, { EApiCode } from "../../../api";

interface IProps {
  groupId?: number;
  onOk: () => void;
  onCancel: () => void;
}

const CreateProjectModal: React.FC<IProps> = (props) => {
  const [form] = useForm();

  const createProject = useCallback(async () => {
    const { groupId } = props;
    const values = form.getFieldsValue() as {
      name: string;
      zhName: string;
      description: string;
      groupId?: number;
    };

    if (!isNil(groupId)) {
      values.groupId = groupId;
    }

    const res = await Api.project.createProject(values);
    if (res.code !== EApiCode.Success) {
      message.error(`创建项目失败：${res.message}`);
      throw new Error(`创建项目失败：${res.message}`);
    }
  }, [props.groupId]);

  return (
    <Modal
      visible={true}
      title="新建项目"
      width="800px"
      onOk={async () => {
        await createProject();
        props.onOk();
      }}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="name"
          label="项目英文名称"
          rules={[
            { required: true, message: "请添加项目英文名称" },
            {
              pattern: new RegExp(/^[a-z0-9-]+$/, "g"),
              message: "仅支持输入小写字母、数字或者中划线",
            },
          ]}
        >
          <Input placeholder="请添加项目英文名称" />
        </Form.Item>
        <Form.Item
          name="zhName"
          label="项目中文名称"
          rules={[{ required: true, message: "请添加项目中文名称" }]}
        >
          <Input placeholder="请添加项目中文名称" />
        </Form.Item>
        <Form.Item name="description" label="项目描述">
          <Input placeholder="请添加项目描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
