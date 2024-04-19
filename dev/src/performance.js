import { node as n } from "./utils.js";

const x = n('div');
document.body.appendChild(x);


const timer = (func) => {
  x.innerHTML = '';
  const start = new Date();
  func();
  const result = new Date() - start;

  // cleanup
  x.innerHTML = '';

  return result;
}

const innerHTML = ({ reps }) => () => {
  x.innerHTML = `
  <ul style="color: red;">
    <li class="jotain">
      this is some thing
      <a href="https://ttj.hu">and here's a link</a>
    </li>
  </ul>
  `.repeat(reps);
}

const node = ({ reps }) => () => {
  const arr = [];
  while (--reps > 0) {
    arr.push(
      n({ _: 'ul', style: { color: 'red' } },
        n({ _: 'li', className: 'jotain' },
          'this is some thing',
          n({ _: 'a', href: 'https://ttj.hu' }, "and here's a link")
        )
      )
    )
  }
  x.replaceChildren(...arr);
}

const testBoth = () => {

  while (true) {
    const reps = prompt('how many reps?');
    if (!isNaN(reps)) {
      [
        innerHTML({ reps: Number(reps) }),
        node({ reps: Number(reps) })
      ].forEach(func => alert(`${func.name} took ${timer(func)} ms to run`))

    } else {
      alert('invalid number')
    }

    if (confirm('wanna quit?')) break;
  }
}

const testView = () => {

  const btn = n({
    _: 'button',
  }, 'testBoth');

  btn.addEventListener('click', testBoth);

  return btn
}

export { timer, innerHTML, node, testBoth, testView }
