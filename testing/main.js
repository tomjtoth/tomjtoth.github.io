import hashRouter from "./src/components/router.js"
import loginView from "./src/views/login.js";

hashRouter('body>nav', 'div#view', {
  some: loginView,
  login: loginView,
  logout: loginView
});

