export const view = ({ view }) => {

  const login = view === 'login';

  const form = String.raw`
        ${login ? '' : String.raw`
          <label for="name">name:</label>
          <input id="name" name="name" required />
          <br />  
        `}
        <label for="username">username:</label>
        <input id="username" name="username" required 
          minlength="3" maxlength="8" />
        <br />
        <label for="password">password:</label>
        <input id="password" name="password" type="password" required
          minlength="8" />
        <br />
        ${login ? '' : String.raw`
          <label for="verify">verify pw:</label>
          <input id="verify" name="verify" type="password" required 
            minlength="8" />
          <br />  
        `}
        <button>${login ? 'login' : 'register'}</button>
  `.toTag('form')

  form.addEventListener('submit', (e) => {

    e.preventDefault();

    if (!login) {

      const { target: {
        password,
        verify,
        username,
        name,
      } } = e;

      name.setCustomValidity(
        (! /[A-Z](?:-?[a-z])* [A-Z](?:-?[a-z])*/.test(name.value))
          ? 'format it as "Firstname Surname"'
          : ''
      );

      username.setCustomValidity(
        (! /^\w+$/.test(username.value))
          ? 'must use only numbers, letters and underscores'
          : ''
      );

      verify.setCustomValidity(
        (password.value !== verify.value)
          ? 'passwords don\'t match'
          : ''
      );

    }

    if (!e.target.reportValidity()) return;

    alert(`TODO: login as "${e.target.username.value
      }:${e.target.password.value
      }"`);
  });

  return form;
}

export default view;
