import { Button, Card, Popconfirm, Space } from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CategoryDetail from "../../../../../component/category-detail/category-detail";
import { ProjectSettingAdvanceStore } from "./project-setting-advance-store";

const ProjectSettingAdvance: React.FC = observer(() => {
  const storeRef = useRef(new ProjectSettingAdvanceStore());
  const { projectId } = useParams() as { projectId: string };

  useEffect(() => {
    storeRef.current.params = {
      projectId: +projectId,
    };
  }, [projectId]);

  const store = storeRef.current;

  return (
    <Card title="高级设置" bodyStyle={{ padding: "12px 24px" }}>
      <CategoryDetail title="删除项目" direction="vertical">
        <div>删除项目将会连同其相关的所有数据一起删除。此操作无法恢复！</div>
        <Space>
          <Popconfirm
            title={`确认删除项目？`}
            onConfirm={async () => {
              await store.deleteProject();
            }}
          >
            <Button type="primary" danger>
              删除项目
            </Button>
          </Popconfirm>
        </Space>
      </CategoryDetail>
    </Card>
  );
});

export default ProjectSettingAdvance;
