import yaml from "js-yaml";

export function storeObject<T>(key: string, val: T): T {
  localStorage.setItem(key, JSON.stringify(val));

  return val;
}

export function loadObject<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);

  return stored ? JSON.parse(stored) : fallback;
}

type ReqFileOptions = {
  asYaml?: boolean;
  asJson?: boolean;
};

async function reqFile(
  file: string,
  { asYaml = false, asJson = false }: ReqFileOptions = {}
): Promise<any> {
  const req = fetch(file);

  if (asYaml) return yaml.load(await req.then((res) => res.text()));
  if (asJson) return req.then((res) => res.json());

  return req;
}

export function fetchYaml(file: string): Promise<any> {
  return reqFile(file, { asYaml: true });
}

export function fetchJson(file: string): Promise<any> {
  return reqFile(file, { asJson: true });
}

export function setDocTitleIcon(title: string, icon = "🤓") {
  document.title = title;
  (
    document.querySelector("link[rel=icon]") as HTMLLinkElement
  ).href = `data:image/svg+xml,
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <text x="50%" y="50%" font-size="90" dominant-baseline="middle" text-anchor="middle">${icon}</text>
  </svg>`;
}

export function idxOf<T>(arr: T[], key: T): number {
  let idx = arr.indexOf(key);

  if (Array.isArray(key)) {
    const jsonKey = JSON.stringify(key);
    idx = arr.findIndex((val) => JSON.stringify(val) === jsonKey);
  }

  return idx;
}

export function toToggled<T>(arr: T[], key: T): T[] {
  const res = [...arr];
  toggle(res, key);
  return res;
}

export function toggle<T>(arr: T[], key: T): void {
  const idx = idxOf(arr, key);

  if (idx === -1) {
    arr.push(key);
  } else {
    arr.splice(idx, 1);
  }
}

export function last<T>(arr: T[], n = 1): T | T[] {
  const idx = arr.length - n;

  if (n > 1) return arr.slice(idx < 0 ? 0 : idx);
  return arr[idx];
}

export function between(n: number, a: number, b: number): boolean {
  if (typeof a !== "number" || typeof b !== "number")
    throw new Error("between needs numbers for comparison");

  return a <= n && n <= b;
}
