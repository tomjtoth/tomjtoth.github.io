import { node as n, qs } from "../utils.js";

const hashRouter = (
  naviContainerQuerySelector,
  viewContainerQuerySelector,
  routes
) => {

  const
    naviContainer = qs(naviContainerQuerySelector),
    viewContainer = qs(viewContainerQuerySelector);

  const ul = n('ul',
    ...Array
      .from(Object.keys(routes))
      .map(route =>
        n('li',
          n(['a', { href: `#/${route}` }], route)
        )
      )
  );

  ul.addEventListener('click', ({ target: { nodeName, hash } }) => {
    if (nodeName !== 'A') return;

    const route = hash.substring(2);
    const handler = routes[route];

    handler(viewContainer);
  })

  naviContainer.appendChild(ul);
}

export default hashRouter
