import React from "react";
import QRCode from "qrcode.react";

interface QRCodeProps {
  value: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ value }) => {
  return (
    <div>
      <QRCode
        value={value}
        size={300}
        bgColor={"#FFFFFF"}
        fgColor={"#000000"}
      />
    </div>
  );
};

export default QRCodeComponent;