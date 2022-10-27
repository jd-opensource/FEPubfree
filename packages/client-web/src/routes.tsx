import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import GroupHolder from "./page/group/group-detail/group-holder/group-holder";
import GroupLayout from "./page/group/group-detail/group-layout";
import GroupProject from "./page/group/group-detail/group-project/group-project";
import GroupSetting from "./page/group/group-detail/group-settiing/group-setting";
import NewGroupList from "./page/group/group-list/group-list";
import ProjectHolder from "./page/project/project-detail/project-holder/project-holder";
import ProjectLayout from "./page/project/project-detail/project-layout";
import ProjectSetting from "./page/project/project-detail/project-setting/project-setting";
import ProjectWorkspace from "./page/project/project-detail/project-workspace/project-workspace";
import ProjectList from "./page/project/project-list/project-list";
import userStore from "./store/user-store";

const Routes: React.FC = observer((props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await userStore.login();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Switch>
        <Route exact path="/projects" component={ProjectList} />
        <Route
          path={"/projects/:projectId"}
          render={(props: any) => (
            <ProjectLayout {...props}>
              <Switch>
                <Route
                  exact
                  path="/projects/:projectId/workspaces/:workspaceId"
                  component={ProjectWorkspace}
                />
                <Route
                  exact
                  path="/projects/:projectId/settings/:type"
                  component={ProjectSetting}
                />
                <Route
                  path="/projects/:projectId/*"
                  component={ProjectHolder}
                />
              </Switch>
            </ProjectLayout>
          )}
        />

        <Route exact path="/groups" component={NewGroupList} />
        <Route
          path="/groups/:groupId"
          render={(props: any) => (
            <GroupLayout {...props}>
              <Switch>
                <Route
                  exact
                  path="/groups/:groupId/projects"
                  component={GroupProject}
                />
                <Route
                  exact
                  path="/groups/:groupId/settings/:type"
                  component={GroupSetting}
                />
                <Route path="/groups/:groupId/*" component={GroupHolder} />
              </Switch>
            </GroupLayout>
          )}
        />

        <Route path="*">
          <Redirect to="/projects" />
        </Route>
      </Switch>
    </>
  );
});

export default Routes;
