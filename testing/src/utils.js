export const byId = (id) => document.getElementById(id)
export const qs = (sel) => document.querySelector(sel)
export const qsa = (sel) => document.querySelectorAll(sel)

export const sortBy = (a, b, key) => b[key] - a[key];
export const hello = () => 'hello';
export const hello2 = () => 'hello2';

export const changeView = (path) =>
  fetch(`src/views/${path}.html`)
    .then(r => r.text())
    .then(html =>
      byId('view').innerHTML = html
    );

