/**
 * Shorthand for `document.getElementById`
 * 
 * @param {String} id id
 * @returns HTMLElement
 */
export const id = (id) => document.getElementById(id)

/**
 * Shorthand for `document.querySelector`
 * 
 * @param {String} sel CSS selector
 * @returns HTMLElement
 */
export const qs = (sel) => document.querySelector(sel)

/**
 * Shorthand for `document.querySelectorAll`
 * 
 * @param {String} sel CSS selector
 * @returns HTMLElement
 */
export const qsa = (sel) => document.querySelectorAll(sel)

/**
 * mimicking something like what React does under the hood,
 * built from scratch, expanding functionality as needed
 * 
 * It is actually slower, than manipulating innerHTML, hmm...
 * 
 * @param {String|Object} tag 
 * `tagName` as string or `{ _:tagName, rest_of_props }` as obj literal
 * @param  {HTMLElement[]} children any number of child elements
 * 
 * @example
 * 
 * ```js
 * const x = node('button', 'click me')
 * ```
 * @returns
 * 
 * ```html
 * <button>click me</button>
 * ```
 * 
 * @example
 * 
 * ```js
 * 
 * const x = node({ _: 'ul', style: { color: 'red' } },
 * 
 *   node({
 *     _: 'li',
 *     style: { fontSize: 30 },
 *     id: 'my-id',
 *     className: 'special-li'
 *   }, 'text of 1st li'),
 * 
 *   node({
 *     _: 'li',
 *     className: 'other-li',
 *     // inline-style as object
 *     style: {
 *       color: 'yellow'
 *     }
 *   }, 'text of 2nd li')
 * );
 * ```
 * 
 * @returns
 * 
 * ```html
 * <ul style="color: red;">
 *   <li id="my-id" class="special-li">text of 1st li</li>
 *   <li class="other-li" style="color: yellow;">text of 2nd li</li>
 * </ul>
 * ```
 * 
 */
export const node = (tag, ...children) => {
  let elem;

  if (typeof tag === 'string') {
    elem = document.createElement(tag);
  }

  else {
    const {
      _: tagName,
      exceptions = null,
      // toHandle = null,
      // differently = null,
      ...rest
    } = tag;

    elem = document.createElement(tagName);

    if (exceptions)
      alert('handle these as you like');

    for (const [key, value] of Object.entries(rest)) {

      if (typeof value === 'object') {
        for (const [iterKey, iterVal] of Object.entries(value)) {
          elem[key][iterKey] = iterVal;
        }
      }

      else {
        elem[key] = value;
      }

    }
  }

  children.forEach(child => elem.appendChild(
    typeof child === 'string'
      ? document.createTextNode(child)
      : child));

  return elem;
}

/**
 * Maps a function to the array, then joins elements by a str
 * 
 * @param {CallableFunction} func function to map to each element
 * @param {string} joinedBy string to join elements with
 * @returns string
 */
Array.prototype.mapAndJoin = function (func, joinedBy = '') {
  return this.map(func).join(joinedBy)
};
