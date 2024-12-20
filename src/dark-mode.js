// on startup
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('dark-mode', true);
}

// changes on-the-fly
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  document.documentElement.setAttribute('dark-mode', event.matches);
});

export default {};
