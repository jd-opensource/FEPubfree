import { Card, PageHeader } from "antd";
import { isNil } from "lodash-es";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import { WideLayout } from "../../../component/layout/wide-layout/wide-layout";
import projectLayoutStore from "./project-layout-store";

const ProjectLayout: React.FC<RouteComponentProps<{ projectId: string }>> =
  observer((props) => {
    const storeRef = useRef(projectLayoutStore);

    useEffect(() => {
      const { projectId } = props.match.params;

      storeRef.current.params = {
        projectId: +projectId,
      };

      storeRef.current.init();

      return () => {
        storeRef.current.destroy();
      };
    }, []);

    const status = toJS(storeRef.current.status);
    const { isLoading, project } = status;

    if (isLoading) {
      return null;
    }

    if (isNil(project)) {
      return null;
    }

    return (
      <WideLayout sideMargin={40}>
        <PageHeader
          title={project.name}
          subTitle={project.description}
          avatar={{
            icon: project.name.charAt(0).toUpperCase(),
            shape: "square",
          }}
        >
          <Card
            activeTabKey={status.curActiveKey}
            tabList={[
              { key: "workspaces", tab: "工作区" },
              { key: "settings", tab: "设置" },
            ]}
            onTabChange={(key) => {
              storeRef.current.switchProjectTab(key);
            }}
          >
            {props.children}
          </Card>
        </PageHeader>
      </WideLayout>
    );
  });

export default ProjectLayout;
