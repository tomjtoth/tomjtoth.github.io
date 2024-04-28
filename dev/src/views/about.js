import { node as n } from "../utils.js"

const view = (viewContainer) =>
  viewContainer.replaceChildren(
    n('p', "this path is for testing purposes under production env :)")
  );

export default view
