import { node, qs } from "../utils.js";

const hashRouter = (
  naviContainerQuerySelector,
  viewContainerQuerySelector,
  routes
) => {

  const
    naviContainer = qs(naviContainerQuerySelector),
    viewContainer = qs(viewContainerQuerySelector),
    links = Array
      .from(Object.keys(routes))
      .map(route => {

        const link = node({ _: 'a', href: `#/${route}` }, route);

        naviContainer.appendChild(link);

        return link;
      });

  const loadView = () => {

    // remove .active from any link
    links.forEach(({ classList }) =>
      classList.remove('active'));

    const { hash, classList } =
      // try matching hash from address bar
      qs(`body>nav>a[href="${window.location.hash}"]`)
      // fallback to the about view
      || links[0];

    const
      route = hash.substring(2),
      handler = routes[route];

    classList.add('active');
    viewContainer.replaceChildren(handler());
  }

  // routing on pageload
  loadView();

  // reacting to back/forward button in browser
  window.addEventListener('hashchange', loadView);
}

export default hashRouter
