import hashRouter from "./components/router.js"
import about from "./views/about.js";
import things from "./views/things.js";
import auth from "./views/auth.js";
import { testView as test } from './performance.js'

const app = () => {

  hashRouter('body>nav', 'div#main-view', {
    about,
    things,
    login: auth,
    register: auth,
    test,
  });

}

export default app
