import { Space } from "antd";
import { Footer } from "antd/lib/layout/layout";
import React from "react";
import styles from "./footer.module.less";

const LayoutFooter: React.FC = () => {
  return (
    <Footer
      style={{ textAlign: "center" }}
      className={styles.commonLayoutFooter}
    >
      <Space direction={"vertical"}>
        <div>Pubfree @2022 Created by Jd</div>
      </Space>
    </Footer>
  );
};

export default LayoutFooter;
