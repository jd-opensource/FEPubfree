import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm, Space, Tag } from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CategoryDetail from "../../../../../component/category-detail/category-detail";
import { GroupSettingAdvanceStore } from "./group-setting-advance-store";

const GroupSettingAdvance: React.FC = observer(() => {
  const storeRef = useRef(new GroupSettingAdvanceStore());
  const { groupId } = useParams() as { groupId: string };

  useEffect(() => {
    storeRef.current.params = {
      groupId: +groupId,
    };

    storeRef.current.init();

    return () => {
      storeRef.current.destroy();
    };
  }, [groupId]);

  const store = storeRef.current;

  return (
    <Card title="高级设置" bodyStyle={{ padding: "12px 24px" }}>
      <CategoryDetail title="删除空间" direction="vertical">
        <div>删除空间将会连同其相关的所有数据一起删除。此操作无法恢复！</div>
        <Tag color="error" icon={<ExclamationCircleOutlined />}>
          删除空间前，请确保空间下已无项目
        </Tag>
        <Space>
          <Popconfirm
            title={`确认删除空间？`}
            onConfirm={async () => {
              await store.deleteGroup();
            }}
          >
            <Button type="primary" danger>
              删除空间
            </Button>
          </Popconfirm>
        </Space>
      </CategoryDetail>
    </Card>
  );
});

export default GroupSettingAdvance;
