import { Button, Card, Empty, List, Row, Spin } from "antd";
import { isEmpty } from "lodash-es";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { WideLayout } from "../../../component/layout/wide-layout/wide-layout";
import { routerStore } from "../../../store/router-store";
import CreateGroupModal from "./components/create-group-modal/create-group-modal";
import groupListStore from "./group-list.store";

const GroupList = observer(() => {
  const storeRef = useRef(groupListStore);

  useEffect(() => {
    storeRef.current.fetchGroupList();
  }, []);

  const store = storeRef.current;
  const status = toJS(store.status);

  return (
    <WideLayout width={1280}>
      <Card>
        {/* 搜索新建区 */}
        <Row justify="end">
          <Button
            type="primary"
            onClick={() => store.setStatus({ isShowCreateModal: true })}
          >
            新建空间
          </Button>
        </Row>

        <Spin spinning={false}>
          <Card title="空间列表" size="small" style={{ marginTop: "15px" }}>
            {!isEmpty(status.groups) && (
              <List
                itemLayout="vertical"
                size="small"
                rowKey="id"
                dataSource={status.groups}
                renderItem={(group) => (
                  <List.Item
                    key={group.id}
                    onClick={() => {
                      routerStore.push(`/groups/${group.id}/projects`);
                    }}
                  >
                    <List.Item.Meta
                      title={group.name}
                      description={group.description}
                    />
                  </List.Item>
                )}
              />
            )}
            {isEmpty(status.groups) && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Spin>
        {status.isShowCreateModal && (
          <CreateGroupModal
            onOk={async () => {
              store.setStatus({ isShowCreateModal: false });
              await store.fetchGroupList();
            }}
            onCancel={() => {
              store.setStatus({ isShowCreateModal: false });
            }}
          />
        )}
      </Card>
    </WideLayout>
  );
});
export default GroupList;
