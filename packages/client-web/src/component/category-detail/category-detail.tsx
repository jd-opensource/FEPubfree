import { Card, Space } from "antd";
import React from "react";

interface IProps {
  title: string;
  direction?: "horizontal" | "vertical";
}

const CategoryDetail: React.FC<IProps> = (props) => {
  const { title, direction = "horizontal" } = props;
  return (
    <Card
      size="small"
      bordered={false}
      title={title}
      headStyle={{ padding: 0, borderBottom: 0 }}
      bodyStyle={{ padding: 0 }}
      style={{ marginBottom: 10 }}
    >
      <Space style={{ width: "100%" }} direction={direction}>
        {props.children}
      </Space>
    </Card>
  );
};

export default CategoryDetail;
