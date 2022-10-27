import { Modal } from "antd";
import React from "react";
import {
  IProjectDeployDTO,
  IProjectDTO,
  IProjectEnvDTO,
} from "../../../../../../interface/client-api/project.interface";
import DeployInfoDescriptions from "../deploy-info-descriptions/deploy-info-descriptions";

interface IProps {
  project: IProjectDTO;
  env: IProjectEnvDTO;
  deploy: IProjectDeployDTO;
  onCancel: () => void;
}

const DeployInfoModal: React.FC<IProps> = (props) => {
  const { project, env, deploy, onCancel } = props;
  return (
    <Modal
      title="部署详情"
      visible={true}
      width="800px"
      footer={null}
      onCancel={async () => {
        await onCancel();
      }}
    >
      <DeployInfoDescriptions project={project} env={env} deploy={deploy} />
    </Modal>
  );
};

export default DeployInfoModal;
