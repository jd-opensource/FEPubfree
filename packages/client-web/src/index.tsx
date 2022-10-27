import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";

import React from "react";
import ReactDOM from "react-dom";
import { Router, Switch } from "react-router-dom";
import PageLayout from "./component/layout/page-layout";
import Routes from "./routes";
import { routerStore } from "./store/router-store";
import "./style/style.less";

ReactDOM.render(
  <Router history={routerStore}>
    <ConfigProvider locale={zhCN}>
      <PageLayout>
        <Switch>
          <Routes />
        </Switch>
      </PageLayout>
    </ConfigProvider>
  </Router>,
  document.getElementById("root")
);
