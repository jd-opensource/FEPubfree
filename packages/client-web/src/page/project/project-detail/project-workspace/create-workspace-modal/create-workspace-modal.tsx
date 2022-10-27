import { Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { EProjectEnvType } from "../../../../../interface/client-api/project.interface";
import { ProjectWorkspaceStore } from "../project-workspace-store";

interface IProps {
  store: ProjectWorkspaceStore;
}

const CreateWorkspaceModal: React.FC<IProps> = (props) => {
  const { store } = props;
  const [form] = useForm();

  return (
    <Modal
      title="新建工作区"
      visible={true}
      width="800px"
      onOk={async () => {
        await form.validateFields();
        const values = form.getFieldsValue() as {
          name: string;
          envType: EProjectEnvType;
        };
        await store.createWorkspace(values.envType, values.name);
      }}
      onCancel={() => {
        store.setStatus({
          isShowCreateModal: false,
        });
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="name"
          label="工作区名称"
          rules={[
            { required: true, message: "请填写工作区名称" },
            {
              pattern: new RegExp(/^[a-z0-9-]+$/, "g"),
              message: "仅支持输入小写字母、数字或者中划线",
            },
          ]}
        >
          <Input placeholder="请填写工作区名称" />
        </Form.Item>

        <Form.Item
          name="envType"
          label="工作区类型"
          rules={[{ required: true, message: "请选择工作区类型" }]}
        >
          <Select placeholder="请选择工作区类型">
            <Select.Option value={EProjectEnvType.Test}>测试</Select.Option>
            <Select.Option value={EProjectEnvType.Gray}>灰度</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
