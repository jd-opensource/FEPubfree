import { isNil } from "lodash-es";
import qrCode from "qrcode";
import React, { useEffect, useState } from "react";

interface IProps {
  url: string;
}

const QrCode: React.FC<IProps> = (props) => {
  const [qrCodeImg, setQrCodeImg] = useState(null);

  useEffect(() => {
    (async () => {
      const baseImg = await qrCode.toDataURL(props.url, {
        errorCorrectionLevel: "L",
        margin: 1,
        width: 150,
        scale: 177,
        type: "image/jpeg",
        rendererOpts: {
          quality: 0.9,
        },
        color: {
          // 二维码背景颜色
          dark: "#40a9ff",
          // 二维码前景颜色
          light: "#fff",
        },
      });

      setQrCodeImg(baseImg);
    })();
  }, [props.url]);

  if (isNil(qrCodeImg)) {
    return null;
  }

  return <img src={qrCodeImg} />;
};

export default QrCode;
