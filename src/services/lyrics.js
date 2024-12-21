import yaml from "js-yaml";

async function load() {
  return yaml.load(await fetch("/lyrics.yaml").then((res) => res.text()));
}

export default {
  load,
};
