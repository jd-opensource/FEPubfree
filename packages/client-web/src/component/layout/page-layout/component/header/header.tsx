import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu } from "antd";
import { Header } from "antd/lib/layout/layout";
import cls from "classnames";
import { isNil } from "lodash-es";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { routerStore } from "../../../../../store/router-store";
import userStore from "../../../../../store/user-store";

interface INavigation {
  name: string;
  path: string;
  pathMath: RegExp;
  // 打开方式
  target?: "_blank" | string;
}

enum EUserMenuKey {
  Username = "username",
  Project = "project",
  Group = "group",
  Setting = "setting",
  Logout = "logout",
}

const LayoutHeader: React.FC = observer(() => {
  const userStoreRef = useRef(userStore);

  const [current, setCurrent] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const nav = navigationArr.find((nav) =>
      nav.pathMath.test(location.pathname)
    );
    setCurrent(nav?.name);
  }, [location.pathname]);

  const onClickUserMenu = useCallback(
    async (menuInfo: { key: EUserMenuKey }) => {
      const { key } = menuInfo;
      switch (key) {
        case EUserMenuKey.Username:
          break;
        case EUserMenuKey.Project:
          routerStore.push(`/projects`);
          break;
        case EUserMenuKey.Group:
          routerStore.push(`/groups`);
          break;
        case EUserMenuKey.Setting:
          routerStore.push(`/user_center`);
          break;
        case EUserMenuKey.Logout:
          await userStoreRef.current.logout();
          routerStore.push(`/`);
          break;
      }
    },
    []
  );

  const navigationArr: INavigation[] = useMemo(
    () => [
      {
        name: "项目列表",
        path: "/projects",
        pathMath: new RegExp(/^\/projects/),
      },
      {
        name: "空间列表",
        path: "/groups",
        pathMath: new RegExp(/^\/groups/),
      },
    ],
    []
  );

  const { userinfo } = toJS(userStoreRef.current.status);

  return (
    <Header
      className={cls({
        "layout-header": true,
      })}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <img
          style={{ display: "block", width: "auto", height: 50 }}
          src="https://storage.360buyimg.com/h5source/pubfree/img/pubfree-logo2.png"
        />
        <Menu
          style={{ flex: 1 }}
          selectedKeys={[current]}
          mode="horizontal"
          theme="dark"
        >
          {navigationArr.map((nav, idx) => (
            <Menu.Item key={nav.name}>
              {nav.target === "_blank" ? (
                <a
                  href={nav.path}
                  target={nav.target === "_blank" && nav.target}
                >
                  {nav.name}
                </a>
              ) : (
                <Link to={nav.path}>{nav.name}</Link>
              )}
            </Menu.Item>
          ))}
        </Menu>
        {isNil(userinfo) && (
          <Button
            type="primary"
            shape="circle"
            icon={<LoginOutlined />}
            onClick={() => {
              alert("JumpToLogin");
            }}
          />
        )}
        {!isNil(userinfo) && (
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            overlay={
              <Menu
                style={{ width: "120px", padding: 0 }}
                onClick={async (menuInfo) => {
                  await onClickUserMenu({ key: menuInfo.key as EUserMenuKey });
                }}
              >
                <Menu.Item key={EUserMenuKey.Username}>
                  {userinfo.name}
                </Menu.Item>
                <Menu.Divider style={{ margin: 0 }} />
                <Menu.Item key={EUserMenuKey.Project}>您的项目</Menu.Item>
                <Menu.Item key={EUserMenuKey.Group}>您的空间</Menu.Item>
                <Menu.Divider style={{ margin: 0 }} />
                <Menu.Item key={EUserMenuKey.Setting}>设置</Menu.Item>
                <Menu.Item key={EUserMenuKey.Logout}>登出</Menu.Item>
              </Menu>
            }
          >
            <Avatar
              style={{ cursor: "pointer" }}
              shape="square"
              icon={<UserOutlined />}
            />
          </Dropdown>
        )}
      </div>
    </Header>
  );
});
export default LayoutHeader;
