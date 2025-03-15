import { QRCodeSVG } from "qrcode.react";
import { MouseEventHandler } from "react";

const QR_OPTS = {
  title: "click to copy URL",
  marginSize: 4,
  bgColor: "var(--color-bg-0)",
  fgColor: "var(--color-fg-0)",
  className: "clickable shrink-0",
  size: 200,
};

type QRCodeProps = {
  value: string;
  onClick: MouseEventHandler;
};

export function QRCode({ value, onClick }: QRCodeProps) {
  return <QRCodeSVG {...{ ...QR_OPTS, value, onClick }} />;
}
