export default function MainView({ children, ...props }) {
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
