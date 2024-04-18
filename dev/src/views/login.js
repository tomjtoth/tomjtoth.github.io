import { node as n } from "../utils.js";

const view = () => {
  const form = n('form',

    n({ _: 'label', htmlFor: 'username' }, 'username:'),

    n({
      _: 'input',
      name: 'username',
      id: 'username',
    }),

    n('br'),

    n({ _: 'label', htmlFor: 'password' }, 'password:'),

    n({
      _: 'input',
      name: 'password',
      id: 'password',
      type: 'password'
    }),

    n('br'),

    n('button', 'login')
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`TODO: login as "${e.target.username.value
      }:${e.target.password.value
      }"`);
  })

  return form;
}

export default view;
