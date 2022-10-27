import { Button, Card, Divider, Input } from "antd";
import { isNil } from "lodash-es";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CategoryDetail from "../../../../../component/category-detail/category-detail";
import { ProjectSettingCommonStore } from "./project-setting-common-store";

interface IProps {}

const ProjectSettingCommon: React.FC<IProps> = observer((props) => {
  const storeRef = useRef(new ProjectSettingCommonStore());
  const { projectId } = useParams() as { projectId: string };

  useEffect(() => {
    storeRef.current.params = {
      projectId: +projectId,
    };
    storeRef.current.init();

    return () => {
      storeRef.current.destroy();
    };
  }, [projectId]);

  const store = storeRef.current;
  const status = toJS(storeRef.current.status);
  const { project } = status;

  if (isNil(project)) {
    return null;
  }

  return (
    <Card title="通用设置" bodyStyle={{ padding: "12px 24px" }}>
      <CategoryDetail title="项目描述">
        <Input
          style={{ width: 400 }}
          value={status.description}
          onChange={(event) => {
            store.setStatus({
              description: event.target.value,
            });
          }}
        />
        <Button
          type="primary"
          onClick={async () => {
            await store.updateProjectDescription();
          }}
        >
          保存
        </Button>
      </CategoryDetail>

      <Divider style={{ margin: "10px 0 2px" }} />

      {/* 临时注释 */}
      {/*<CategoryDetail title="访问权限" direction={"vertical"}>*/}
      {/*  <div>选择内网时，该项目只能在京东内网环境下才可以访问。</div>*/}
      {/*  <Radio.Group*/}
      {/*    style={{ paddingLeft: 10 }}*/}
      {/*    value={status.isAllowOuterHostnameVisit}*/}
      {/*    onChange={async (event) => {*/}
      {/*      // TODO*/}
      {/*      store.setStatus({*/}
      {/*        isAllowOuterHostnameVisit: event.target.value,*/}
      {/*      });*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Space direction="vertical">*/}
      {/*      <Radio value={false}>内网</Radio>*/}
      {/*      <Radio value={true}>公网</Radio>*/}
      {/*    </Space>*/}
      {/*  </Radio.Group>*/}
      {/*</CategoryDetail>*/}

      {/*<Divider style={{ margin: "10px 0 2px" }} />*/}

      {/*<CategoryDetail*/}
      {/*  title="开启单域名多资源模式（原 Public Path）"*/}
      {/*  direction="vertical"*/}
      {/*>*/}
      {/*  <div>*/}
      {/*    开启单域名多资源模式支持时，会基于生效记录中的资源地址作为基础路径，然后与当前访问链接的*/}
      {/*    Path 拼接当做真实地址请求。*/}
      {/*  </div>*/}
      {/*  <div className="danger">*/}
      {/*    开启此选项极其影响性能，若项目流量较高，切勿开启。*/}
      {/*  </div>*/}
      {/*  <Radio.Group*/}
      {/*    style={{ paddingLeft: 10 }}*/}
      {/*    value={status.supportPublicPath}*/}
      {/*    onChange={async (event) => {*/}
      {/*      // TODO*/}
      {/*      store.setStatus({*/}
      {/*        supportPublicPath: event.target.value,*/}
      {/*      });*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Space direction="vertical">*/}
      {/*      <Radio value={true}>开启</Radio>*/}
      {/*      <Radio value={false}>关闭</Radio>*/}
      {/*    </Space>*/}
      {/*  </Radio.Group>*/}
      {/*</CategoryDetail>*/}
    </Card>
  );
});

export default ProjectSettingCommon;
