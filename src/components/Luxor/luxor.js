const luxor_conti = document.querySelector("div#luxor > div#container");
const HEADER = `<tr><th>L</th><th>U</th><th>X</th><th>O</th><th>R</th></tr>`;

const placeholder = [
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
];

const make_row = (row) =>
  `<tr>${row.map(
    (num) => `<td contenteditable class="luxor-num-${num}">${num}</td>`
  )}</tr>`;

const make_field = (field) => {
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>${HEADER}</thead>
    <tbody>${field.map(make_row)}</tbody>
    `;

  return table;
};

luxor_conti.replaceChildren(
  ...JSON.parse(
    localStorage.getItem("luxor") || JSON.stringify(placeholder)
  ).map(make_field)
);
