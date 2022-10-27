import { InboxOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import React, { useState } from "react";
import { WorkspaceSingleStore } from "../workspace-single-store";

interface IProps {
  store: WorkspaceSingleStore;
}

const CreateDeployFile: React.FC<IProps> = (props) => {
  const { store } = props;
  const [file, setFile] = useState(null);

  return (
    <Modal
      title="ZIP发布"
      visible={true}
      maskClosable={false}
      width="800px"
      onOk={async () => {
        await store.handleCreateDeployFile(file);
      }}
      onCancel={() => {
        store.setStatus({
          isShowCreateDeployFile: false,
        });
      }}
    >
      <Upload.Dragger
        maxCount={1}
        showUploadList={false}
        customRequest={(options) => {
          setFile(options.file);
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {file
            ? file.name
            : "点击或者拖拽 .zip 文件到此处（支持单独上传 html 文件）"}
        </p>
      </Upload.Dragger>
    </Modal>
  );
};

export default CreateDeployFile;
