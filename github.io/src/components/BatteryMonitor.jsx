export default function () {
  return (
    <>
      <p>
        This is a simple utility that will alert if the battery level is
        <ul>
          <li>either above the maximum threshold and still charging</li>
          <li>or below the minimum threshold and not charging</li>
        </ul>
        The related <code>navigator.getBattery()</code> method is not supported
        on all browsers, see the full compatibility table{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery#browser_compatibility">
          on MDN
        </a>
        . The codebase should be converted to a <code>setTimeout</code> vs{" "}
        <code>clearTimeout</code>
        basis, as currently stopping the timer is buggy. Will continue when
        personally interested in this functionality.
      </p>
      <div>
        <label for="bat-mon-max">maximum threshold:</label>
        <input id="bat-mon-max" type="number" min="50" max="100"></input>
      </div>
      <div>
        <label for="bat-mon-min">minimum threshold:</label>
        <input id="bat-mon-min" type="number" min="0" max="50"></input>
      </div>
      <div>
        <button>start</button>
        <button>toggle autostart</button>
      </div>
    </>
  );
}
