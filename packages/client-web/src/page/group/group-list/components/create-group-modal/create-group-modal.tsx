import { Form, Input, message, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useCallback } from "react";
import Api, { EApiCode } from "../../../../../api";

interface IProps {
  onOk: () => void;
  onCancel: () => void;
}

const CreateGroupModal: React.FC<IProps> = (props) => {
  const [form] = useForm();

  const createGroup = useCallback(async () => {
    const values = form.getFieldsValue() as {
      name: string;
      description: string;
    };

    const res = await Api.group.createGroup(values);
    if (res.code === EApiCode.Success) {
      message.success("创建空间成功 ");
    } else {
      message.error(`创建空间失败：${res.message}`);
    }
  }, []);

  return (
    <Modal
      visible={true}
      title="新建空间"
      width="800px"
      onOk={async () => {
        await createGroup();
        props.onOk();
      }}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="name"
          label="空间名称"
          rules={[{ required: true, message: "请添加空间名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="空间描述"
          rules={[{ required: true, message: "请添加空间描述" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;
