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

    // letting each view deal with the necessary updates 
    // in case only a small change happens in the hash
    handler(viewContainer, route);
  }

  // routing on pageload
  loadView();

  // reacting to back/forward button in browser
  window.addEventListener('hashchange', loadView);
}

export default hashRouter
