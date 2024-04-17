import { node as n } from "../utils.js"

const view = (container) => {
  container.replaceChildren(
    n('p', 'this is a placeholder for the things view')
  );
}

export default view
