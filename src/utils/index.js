import yaml from "js-yaml";

export function storeObject(key, val) {
  localStorage.setItem(key, JSON.stringify(val));

  return val;
}

export function loadObject(key, fallback) {
  const stored = localStorage.getItem(key);

  return stored ? JSON.parse(stored) : fallback;
}

async function reqFile(file, { asYaml = false, asJson = false } = {}) {
  const req = fetch(file);

  if (asYaml) return yaml.load(await req.then((res) => res.text()));
  if (asJson) return req.then((res) => res.json());

  return req;
}

export function fetchYaml(file) {
  return reqFile(file, { asYaml: true });
}

export function fetchJson(file) {
  return reqFile(file, { asJson: true });
}

export function genericToggle(reducer_name, key, state, { payload }) {
  // maintaining state immutability?
  const arr = [...state[key]];

  const idx = arr.indexOf(payload);
  if (idx === -1) {
    arr.push(payload);
  } else {
    arr.splice(idx, 1);
  }

  const next = { ...state };
  next[key] = arr;
  if (reducer_name) storeObject(reducer_name, next);
  return next;
}

export function setDocTitleIcon(title, icon = "🤓") {
  document.title = title;
  document.querySelector("link[rel=icon]").href = `data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text y=".9em" font-size="90">${icon}</text>
    </svg>`;
}
