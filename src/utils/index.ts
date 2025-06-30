// import yaml from "js-yaml";

// /**
//  * to be used when blocking is necessary or payload is fixed and small sized
//  * @param key
//  * @param fallback
//  * @returns
//  */
// export function storeObject<T>(key: string, val: T): T {
//   localStorage.setItem(key, JSON.stringify(val));
//   return val;
// }

// /**
//  * to be used when blocking is necessary or payload is fixed and small sized
//  * @param key
//  * @param fallback
//  * @returns
//  */
// export function loadObject<T>(key: string, fallback: T): T {
//   const stored = localStorage.getItem(key);
//   return stored ? JSON.parse(stored) : fallback;
// }

// type ReqFileOptions = {
//   asYaml?: boolean;
//   asJson?: boolean;
// };

// async function reqFile(
//   file: string,
//   { asYaml = false, asJson = false }: ReqFileOptions = {}
// ): Promise<any> {
//   const req = fetch(file);

//   if (asYaml) return yaml.load(await req.then((res) => res.text()));
//   if (asJson) return req.then((res) => res.json());

//   return req;
// }

// export function fetchYaml(file: string): Promise<any> {
//   return reqFile(file, { asYaml: true });
// }

// export function fetchJson(file: string): Promise<any> {
//   return reqFile(file, { asJson: true });
// }

export function toggle<T>(arr: T[], key: T): void {
  const idx = arr.indexOf(key);

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

export function between(num: number, lower: number, upper: number): boolean {
  return lower <= num && num <= upper;
}

export function maxId<T extends { id: number }>(arr: T[]): number {
  return Math.max(0, ...arr.map((entity) => entity.id));
}

const FLAG_EXTRACTOR = /(?<=^|\s)::([A-Z]{2})\b/g;

export function ccToFlags(text: string) {
  return text.replaceAll(FLAG_EXTRACTOR, (_, code: string) => {
    const xx = new Intl.DisplayNames(["en"], { type: "region" }).of(code);

    if (xx === code) {
      return "";
    }

    return code
      .split("")
      .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
      .join("");
  });
}

export function nameOf(fn: CallableFunction) {
  const name = fn.name;
  return `function ${name === "" ? "anonymous" : name}`;
}

export function setCookie(
  name: string,
  value: string | number,
  maxAgeInDays: number = 7
) {
  const key = encodeURIComponent(name);
  const val = encodeURIComponent(value);
  const age = 60 * 60 * 24 * maxAgeInDays;
  document.cookie = `${key}=${val};max-age=${age};path=/`;
}

const COOKIES_AMPERSAND = /; */;

export function getCookie(name: string): string | null {
  const keyEQ = encodeURIComponent(name) + "=";

  for (const cookie of document.cookie.split(COOKIES_AMPERSAND)) {
    if (cookie.startsWith(keyEQ)) {
      return decodeURIComponent(cookie.substring(keyEQ.length));
    }
  }

  return null;
}

export function pad(num: number | string, len = 2) {
  return num.toString().padStart(len, "0");
}

export function secToMMSS(SS: number) {
  const MM = SS / 60;
  return `${pad(Math.floor(MM))}:${pad(Math.floor(SS % 60))}`;
}

export const IS_TOUCH_DEVICE = navigator.maxTouchPoints > 0;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
