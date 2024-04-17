export const byId = (id) => document.getElementById(id)
export const qs = (sel) => document.querySelector(sel)
export const qsa = (sel) => document.querySelectorAll(sel)

export const sortBy = (a, b, key) => b[key] - a[key];
export const hello = () => 'hello';
export const hello2 = () => 'hello2';

/**
 * mimicking something like what React does under the hood,
 * built from scratch, expanding functionality as needed
 * 
 * @param {String|[String, Object]} element either the type of element or type & options
 * @param  {HTMLElement[]} children 
 */
export const node = (element, ...children) => {
  let elem;

  if (typeof element === 'string') {
    elem = document.createElement(element);
  }

  else {
    elem = document.createElement(element[0]);

    const {
      style = null,
      ...rest
    } = element[1];

    if (style) {
      for (const [key, val] of Object.entries(style)) {
        elem.style[key] = val;
      }
    }

    for (const [key, val] of Object.entries(rest)) {
      elem[key] = val;
    }

  }

  children.forEach(child => elem.appendChild(
    typeof child === 'string'
      ? document.createTextNode(child)
      : child));

  return elem;
}
