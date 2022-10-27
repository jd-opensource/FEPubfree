import { Card, PageHeader } from "antd";
import { isNil } from "lodash-es";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import { WideLayout } from "../../../component/layout/wide-layout/wide-layout";
import groupLayoutStore from "./group-layout-store";

const GroupLayout: React.FC<RouteComponentProps<{ groupId: string }>> =
  observer((props) => {
    const storeRef = useRef(groupLayoutStore);

    useEffect(() => {
      const { groupId } = props.match.params;
      storeRef.current.params = {
        groupId: +groupId,
      };

      storeRef.current.init();

      return () => {
        storeRef.current.destroy();
      };
    }, []);

    const status = toJS(storeRef.current.status);
    const { isLoading, curActiveKey, group } = status;

    if (isLoading) {
      return null;
    }

    if (isNil(group)) {
      return null;
    }

    return (
      <WideLayout width={1280}>
        <PageHeader
          title={group.name}
          subTitle={group.description}
          avatar={{
            icon: group.name.charAt(0).toUpperCase(),
            shape: "square",
          }}
        >
          <Card
            activeTabKey={curActiveKey}
            tabList={[
              { key: "projects", tab: "项目列表" },
              { key: "settings", tab: "设置" },
            ]}
            onTabChange={(key) => {
              storeRef.current.switchGroupTab(key);
            }}
          >
            {props.children}
          </Card>
        </PageHeader>
      </WideLayout>
    );
  });

export default GroupLayout;
