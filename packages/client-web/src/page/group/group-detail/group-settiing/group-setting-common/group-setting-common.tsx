import { Card, Input } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CategoryDetail from "../../../../../component/category-detail/category-detail";
import { GroupSettingCommonStore } from "./group-setting-common-store";

const GroupSettingCommon: React.FC = observer(() => {
  const storeRef = useRef(new GroupSettingCommonStore());
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

  const status = toJS(storeRef.current.status);

  if (status.isLoading) {
    return null;
  }

  return (
    <Card title="通用设置" bodyStyle={{ padding: "12px 24px" }}>
      <CategoryDetail title="空间名称">
        <Input disabled value={status.group.name} />
      </CategoryDetail>
    </Card>
  );
});

export default GroupSettingCommon;
