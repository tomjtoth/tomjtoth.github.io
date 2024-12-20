import { node as n } from "../utils.js"

const view = (viewContainer) =>
  viewContainer.replaceChildren(
    n('p', 'this is a placeholder for the things view')
  );

export default view
