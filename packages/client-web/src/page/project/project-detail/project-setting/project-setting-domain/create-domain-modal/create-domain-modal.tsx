import { Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { IProjectEnvDTO } from "../../../../../../interface/client-api/project.interface";
import { ProjectSettingDomainStore } from "../project-setting-domain-store";

interface IProps {
  store: ProjectSettingDomainStore;
  envs: IProjectEnvDTO[];
}

const CreateDomainModal: React.FC<IProps> = (props) => {
  const { store, envs } = props;
  const [form] = useForm();

  return (
    <Modal
      visible={true}
      title="新增域名映射"
      width="800px"
      onOk={async () => {
        await form.validateFields();
        const { projectEnvId, host } = form.getFieldsValue() as {
          projectEnvId: string;
          host: string;
        };
        await store.createProjectDomain({
          projectEnvId: +projectEnvId,
          host: host,
        });
      }}
      onCancel={() => store.setStatus({ isShowCreateDomainModal: false })}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="projectEnvId"
          label="选择工作区"
          rules={[{ required: true, message: "请选择工作区" }]}
        >
          <Select>
            {envs.map((area) => (
              <Select.Option key={area.id} value={area.id}>
                {`${area.name}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="host"
          label="个性化域名"
          rules={[
            {
              required: true,
              message: "请填写个性化域名地址",
            },
            {
              pattern: new RegExp(
                /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
                "g"
              ),
              message:
                "当前只支持最大长度 255，由数字、字母以及中划线组成的域名格式",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDomainModal;
