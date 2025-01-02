import { QRCodeSVG } from "qrcode.react";

const QR_OPTS = {
  id: "qr-code",
  title: "click to copy URL",
  marginSize: 4,
  bgColor: "var(--col-bg-0)",
  fgColor: "var(--col-fg-0)",
  className: "clickable",
  size: 200,
};

export default function ({ value }) {
  return <QRCodeSVG {...{ ...QR_OPTS, value }} />;
}
