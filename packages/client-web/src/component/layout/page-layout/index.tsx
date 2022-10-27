import { Layout } from "antd";
import React from "react";
import Footer from "./component/footer/footer";
import Header from "./component/header/header";

const PageLayout: React.FC = (props) => {
  const { Content } = Layout;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Content
        style={{
          flex: 1,
        }}
      >
        {props.children}
      </Content>
      <Footer />
    </Layout>
  );
};
export default PageLayout;
