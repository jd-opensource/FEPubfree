import { Tabs } from "antd";
import { isNil } from "lodash-es";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import projectLayoutStore from "../project-layout-store";
import ProjectSettingAdvance from "./project-setting-advance/project-setting-advance";
import ProjectSettingCommon from "./project-setting-common/project-setting-common";
import ProjectSettingDomain from "./project-setting-domain/project-setting-domain";
import ProjectSettingMember from "./project-setting-member/project-setting-member";
import { ESettingType, ProjectSettingStore } from "./project-setting-store";
import styles from "./project-setting.module.less";

const ProjectSetting: React.FC<
  RouteComponentProps<{
    projectId: string;
    type: ESettingType;
  }>
> = observer((props) => {
  const storeRef = useRef(new ProjectSettingStore());

  useEffect(() => {
    projectLayoutStore.setStatus({ curActiveKey: "settings" });
  }, []);

  useEffect(() => {
    const { projectId, type } = props.match.params;
    storeRef.current.params = {
      projectId: +projectId,
      type: type,
    };

    storeRef.current.init();

    return () => {
      storeRef.current.destroy();
    };
  }, []);

  const status = toJS(storeRef.current.status);

  if (isNil(storeRef.current.params)) {
    return null;
  }

  return (
    <div className={styles.projectSetting}>
      <Tabs
        className="project-setting-tabs"
        type="card"
        activeKey={status.curActiveType}
        tabPosition="left"
        tabBarStyle={{
          width: "170px",
          textAlign: "left",
        }}
        onTabClick={(key: string) =>
          storeRef.current.switchSettingType(key as ESettingType)
        }
      >
        <Tabs.TabPane key={ESettingType.Common} tab="通用设置">
          <ProjectSettingCommon />
        </Tabs.TabPane>

        <Tabs.TabPane key={ESettingType.Members} tab="成员管理">
          <ProjectSettingMember />
        </Tabs.TabPane>

        <Tabs.TabPane key={ESettingType.Domain} tab="个性化域名">
          <ProjectSettingDomain />
        </Tabs.TabPane>

        <Tabs.TabPane key={ESettingType.Advance} tab="高级设置">
          <ProjectSettingAdvance />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
});

export default ProjectSetting;
