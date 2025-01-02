export default function ({ rKey, steps }) {
  return (
    <ol className="recipe-steps">
      {steps.map((__html, i) => {
        const key = `${rKey}-step-${i}`;

        return <li key={key} dangerouslySetInnerHTML={{ __html }} />;
      })}
    </ol>
  );
}
