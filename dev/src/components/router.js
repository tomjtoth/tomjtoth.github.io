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
      .map(route =>
        node({ _: 'a', href: `#/${route}` }, route)
      );

  naviContainer.replaceChildren(...links);

  const activateView = ({ hash, classList }) => {
    classList.add('active');

    const
      route = hash.substring(2),
      handler = routes[route];

    handler(viewContainer);
  }

  // this routes on pageload,
  // e.g. the user goes directly to `/#/about` instead of `/` first
  const preset = qs(`body>nav>a[href="${window.location.hash}"]`)
  activateView(preset ? preset : links[0]);

  naviContainer.addEventListener('click', ({ target: t }) => {
    if (t.nodeName !== 'A') return;

    // deactivate the other links
    links.forEach(({ classList }) => classList.remove('active'));

    activateView(t);
  })
}

export default hashRouter
