import hashRouter from "./src/components/router.js"
import aboutView from "./src/views/about.js";
import thingsView from "./src/views/things.js";
import loginView from "./src/views/login.js";

hashRouter('body>nav', 'div#view', {
  about: aboutView,
  things: thingsView,
  login: loginView,
});
