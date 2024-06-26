const view = (viewContainer, { view }) => {

  const login = view === 'login';

  const form = String.raw`
    ${login ? '' : String.raw`
    <div>
      <label for="name">name:</label>
      <input id="name" name="name" required />
    </div>
    `}

    <div>
      <label for="username">username:</label>
      <input id="username" name="username" required 
      minlength="3" maxlength="8" />
    </div>

    <div>
      <label for="password">password:</label>
      <input id="password" name="password" type="password" required
      minlength="8" />
    </div>

    ${login ? '' : String.raw`
    <div>
      <label for="verify">verify pw:</label>
      <input id="verify" name="verify" type="password" required 
      minlength="8" />
    </div>
    `}
    <button>${login ? 'login' : 'register'}</button>
  `.toTag('form')

  form.addEventListener('change', ({ target }) =>
    target.setCustomValidity('')
  );

  form.addEventListener('submit', (event) => {

    event.preventDefault();

    if (!login) {

      const { target: {
        password,
        verify,
        username,
        name,
      } } = event;

      if (! /[A-Z](?:-?[a-z])* +[A-Z](?:-?[a-z])*/.test(name.value))
        name.setCustomValidity('format it as "Firstname Surname"');

      if (! /^\w+$/.test(username.value))
        username.setCustomValidity(
          'must use only numbers, letters and underscores'
        );

      if (password.value !== verify.value)
        verify.setCustomValidity('passwords don\'t match');
    }

    if (!event.target.reportValidity()) return;

    alert(`TODO: login as "${event.target.username.value
      }:${event.target.password.value
      }"`);
  });

  form.classList.add('auth');
  viewContainer.replaceChildren(form);
}

export default view;
