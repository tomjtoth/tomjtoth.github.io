import { qs } from "../utils.js";

const hashRouter = (
  naviContainerQuerySelector,
  viewContainerQuerySelector,
  routes
) => {

  const
    naviContainer = qs(naviContainerQuerySelector),
    viewContainer = qs(viewContainerQuerySelector);

  naviContainer.innerHTML = Array
    .from(Object.keys(routes))
    .mapAndJoin(route => `<a href="#/${route}">${route}</a>`);

  const links = Array.from(naviContainer.childNodes);

  const loadView = () => {

    // remove .active from any link
    links.forEach(({ classList }) =>
      classList.remove('active'));

    const { groups: route } = window.location.hash
      .match(/(#\/?)(?<view>[^\/\s\?]+)(?<resource>\/[^\?\s]+)?(?<search>\?.+)?/)
      || { groups: {} };

    const { hash, classList } =
      links.find(a => a.hash === `#/${route.view}`)
      // fallback to the 1st view
      || links[0];

    classList.add('active');
    const handler = routes[hash.substring(2)];

    viewContainer.replaceChildren(handler(route));
  }

  // routing on pageload
  loadView();

  // reacting to back/forward button in browser
  window.addEventListener('hashchange', loadView);
}

export default hashRouter
