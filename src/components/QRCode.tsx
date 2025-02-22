import { QRCodeSVG } from "qrcode.react";
import { MouseEventHandler } from "react";

const QR_OPTS = {
  title: "click to copy URL",
  marginSize: 4,
  bgColor: "var(--col-bg-0)",
  fgColor: "var(--col-fg-0)",
  className: "clickable m-[25px]",
  size: 200,
};

type QRCodeProps = {
  value: string;
  onClick: MouseEventHandler;
};

export default function QRCode({ value, onClick }: QRCodeProps) {
  return <QRCodeSVG {...{ ...QR_OPTS, value, onClick }} />;
}
