export default function ({ children, ...props }) {
  return (
    <div
      {...{
        ...props,
        id: "main",
      }}
    >
      {children}
    </div>
  );
}
