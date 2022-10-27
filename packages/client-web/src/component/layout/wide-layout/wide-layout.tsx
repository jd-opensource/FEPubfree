import React, { useMemo } from "react";
import styles from "./wide-layout.module.less";

interface IProps {
  width?: number | string;
  sideMargin?: number | string;
}

export const WideLayout: React.FC<IProps> = (props) => {
  const { width = "auto", sideMargin } = props;

  const targetStyle = useMemo(() => {
    if (width === "auto") {
      return {
        width: "auto",
        margin: `20px ${sideMargin}px`,
      };
    } else {
      return {
        width: width,
        margin: `20px auto`,
      };
    }
  }, [width, sideMargin]);

  return (
    <div className={styles.wideLayout} style={targetStyle}>
      <div className={styles.layoutCenterContainer}>
        <div className={styles.layoutCenterInner}>{props.children}</div>
      </div>
    </div>
  );
};
