async function load() {
  return await fetch("/recipies.md").then((res) => res.text());
}

export default {
  load,
};
