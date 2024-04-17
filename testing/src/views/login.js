import { node as n, qs } from "../utils.js";

const view = (container) => {
  const view = n('form',

    n(['label', { htmlFor: 'username' }], 'username:'),

    n(['input', {
      name: 'username',
      id: 'username',
    }]),

    n('br'),

    n(['label', { htmlFor: 'password' }], 'password:'),

    n(['input', {
      name: 'password',
      id: 'password',
      type: 'password'
    }]),

    n('br'),

    n('button', 'login')
  );

  view.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`TODO: login as "${e.target.username.value
      }:${e.target.password.value
      }"`);
  })

  container.replaceChildren(view);
}

export default view;
