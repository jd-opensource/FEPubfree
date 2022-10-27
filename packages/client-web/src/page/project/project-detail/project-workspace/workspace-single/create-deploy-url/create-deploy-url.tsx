import { Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { WorkspaceSingleStore } from "../workspace-single-store";

interface IProps {
  store: WorkspaceSingleStore;
}

const CreateDeployUrl: React.FC<IProps> = (props) => {
  const { store } = props;
  const [form] = useForm();

  return (
    <Modal
      title="新增发布"
      visible={true}
      maskClosable={false}
      width="800px"
      onOk={async () => {
        const { target, remark } = form.getFieldsValue();
        await store.handleCreateDeployUrl(target, remark);
      }}
      onCancel={() => {
        store.setStatus({
          isShowCreateDeployUrl: false,
        });
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="target"
          label="静态资源地址"
          rules={[{ required: true, message: "请添加资源地址" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="remark"
          label="说明"
          rules={[{ required: true, message: "请添加发布说明" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDeployUrl;
