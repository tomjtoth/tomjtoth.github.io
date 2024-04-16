import { qs, changeView } from "./src/utils.js"

qs('body>nav').addEventListener('click', e => {
  e.preventDefault()
  changeView(e.target.hash.replace('#/', ''))
});
