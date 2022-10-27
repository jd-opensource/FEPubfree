import { Button, Card, Empty, Input, List, Pagination, Row, Spin } from "antd";
import { isEmpty } from "lodash-es";
import React from "react";
import { IProjectDTO } from "../../../interface/client-api/project.interface";
import ProjectItem from "./project-item/project-item";

interface IProps {
  isLoading?: boolean;
  searchWord?: string;

  projects: IProjectDTO[];
  projectsTotal: number;
  curPage: number;

  onSearch: (searchVal: string) => Promise<void> | void;
  onPageChange: (page: number) => Promise<void> | void;

  onClickCreate: () => void;
}

const ProjectListCard: React.FC<IProps> = (props) => {
  const {
    isLoading = false,
    searchWord,
    projects,
    projectsTotal,
    curPage,
    onSearch,
    onPageChange,
    onClickCreate,
  } = props;

  return (
    <div>
      <Row justify="space-between">
        <Input.Search
          defaultValue={searchWord}
          style={{ width: 400 }}
          placeholder="项目搜索"
          enterButton
          onSearch={async (value) => {
            await onSearch(value);
          }}
        />
        <Button type="primary" onClick={() => onClickCreate()}>
          新建项目
        </Button>
      </Row>

      <Spin spinning={isLoading}>
        <Card
          title="项目列表"
          size="small"
          style={{ marginTop: "15px" }}
          bodyStyle={{ padding: "0" }}
        >
          {!isEmpty(projects) && (
            <List
              itemLayout="vertical"
              size="small"
              rowKey="id"
              dataSource={projects}
              renderItem={(project) => <ProjectItem project={project} />}
            />
          )}
          {isEmpty(projects) && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>
      </Spin>
      <Pagination
        style={{ marginTop: "10px", float: "right" }}
        pageSize={10}
        showSizeChanger={false}
        total={projectsTotal}
        current={curPage}
        onChange={async (page, pageSize) => {
          await onPageChange(page);
        }}
      />
    </div>
  );
};

export default ProjectListCard;
