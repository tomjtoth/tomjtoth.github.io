import hashRouter from "./src/components/router.js"
import about from "./src/views/about.js";
import things from "./src/views/things.js";
import login from "./src/views/login.js";
import { testView as test } from './src/performance.js'

hashRouter('body>nav', 'div#view', {
  about,
  things,
  login,
  register: login.bind(null, false),
  test,
});
