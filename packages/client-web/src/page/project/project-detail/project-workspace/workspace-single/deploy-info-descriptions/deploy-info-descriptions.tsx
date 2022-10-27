import { Descriptions, Empty } from "antd";
import { isNil } from "lodash-es";
import React, { useMemo } from "react";
import QrCode from "../../../../../../component/qrcode/qrcode";
import {
  IProjectDeployDTO,
  IProjectDTO,
  IProjectEnvDTO,
} from "../../../../../../interface/client-api/project.interface";
import { getNormalUrl } from "../../../../../../util/get-normal-url";
import { timeFormat } from "../../../../../../util/time-format";

interface IProps {
  project: IProjectDTO;
  env: IProjectEnvDTO;
  deploy: IProjectDeployDTO;
}

const DeployInfoDescriptions: React.FC<IProps> = (props) => {
  const { project, env, deploy } = props;

  if (isNil(deploy)) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const httpsLink = useMemo(() => {
    return getNormalUrl(project, env);
  }, [project, env]);

  return (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="发布序号" span={2}>
        {deploy.id}
      </Descriptions.Item>
      <Descriptions.Item label="HTTPS 链接" span={2}>
        <a href={httpsLink} target="_blank">
          {httpsLink}
        </a>
      </Descriptions.Item>
      <Descriptions.Item label="HTTPS 二维码" span={2}>
        <QrCode url={httpsLink} />
      </Descriptions.Item>
      <Descriptions.Item label="创建人" span={1}>
        {deploy.createUser.name || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间" span={1}>
        {timeFormat(deploy.createdAt)}
      </Descriptions.Item>
      <Descriptions.Item label="发布人" span={1}>
        {deploy.actionUser.name || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="发布时间" span={1}>
        {timeFormat(deploy.updatedAt)}
      </Descriptions.Item>
      <Descriptions.Item label="资源地址" span={2}>
        <a href={deploy.target} target="_blank">
          {deploy.target || "--"}
        </a>
      </Descriptions.Item>
      <Descriptions.Item label="说明" span={2}>
        {deploy.remark || "--"}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DeployInfoDescriptions;
