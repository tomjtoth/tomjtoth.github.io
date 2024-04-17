import { node as n } from "./utils.js";

const x = n('div');
document.body.appendChild(x);


const timer = (func) => {
  const start = new Date();
  func();
  console.log('took:', (new Date() - start), 'ms to finish');
}

const innerHTML = (reps = 1000) => {
  x.innerHTML = '';
  timer(() => {
    x.innerHTML = `
    <ul style="color: red;">
      <li class="jotain">
        this is some thing
        <a href="https://ttj.hu">and here's a link</a>
      </li>
    </ul>
    `.repeat(reps);
  })

}

const node = (reps = 1000) => {
  timer(() => {
    const arr = [];
    while (--reps > 0) {
      arr.push(
        n(['ul', { style: { color: 'red' } }],
          n(['li', { className: 'jotain' }],
            'this is some thing',
            n(['a', { href: 'https://ttj.hu' }], "and here's a link")
          )
        )
      )
    }
    x.replaceChildren(...arr);
  })
}

export default { innerHTML, node }
