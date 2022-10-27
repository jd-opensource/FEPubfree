import { Tabs } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import groupLayoutStore from "../group-layout-store";
import GroupSettingAdvance from "./group-setting-advance/group-setting-advance";
import GroupSettingCommon from "./group-setting-common/group-setting-common";
import GroupSettingMember from "./group-setting-member/group-setting-member";
import { ESettingType, GroupSettingStore } from "./group-setting-store";
import styles from "./group-setting.module.less";

const GroupSetting: React.FC = observer((props) => {
  const storeRef = useRef(new GroupSettingStore());
  const { groupId, type } = useParams() as {
    groupId: string;
    type: ESettingType;
  };

  useEffect(() => {
    groupLayoutStore.setStatus({ curActiveKey: "settings" });
  }, []);

  useEffect(() => {
    storeRef.current.params = {
      groupId: +groupId,
      type: type,
    };

    storeRef.current.init();

    return () => {
      storeRef.current.destroy();
    };
  }, []);

  const status = toJS(storeRef.current.status);
  const { curActiveType } = status;

  return (
    <div className={styles.groupSetting}>
      <Tabs
        className="group-setting-tabs"
        type="card"
        activeKey={curActiveType}
        tabPosition="left"
        tabBarStyle={{
          width: "170px",
          textAlign: "left",
        }}
        onTabClick={(key: string) => {
          storeRef.current.switchSettingType(key as ESettingType);
        }}
      >
        <Tabs.TabPane key={ESettingType.Common} tab="通用设置">
          <GroupSettingCommon />
        </Tabs.TabPane>
        <Tabs.TabPane key={ESettingType.Members} tab="成员管理">
          <GroupSettingMember />
        </Tabs.TabPane>
        <Tabs.TabPane key={ESettingType.Advance} tab="高级设置">
          <GroupSettingAdvance />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
});

export default GroupSetting;
