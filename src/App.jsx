import { Routes, Route, useMatch, useNavigate } from "react-router";
import "./App.css";

function App() {
  return (
    <div lang="en">
      <h1>Vite + React</h1>
      <p>
        Migration in progress while Santa Clause is coming... The following
        files
        <ul>
          <li>
            <a href="recipies/README.md">recipies</a>
          </li>
          <li>
            <a href="linux/clonefig.sh">clonefig</a>
          </li>

          <li>
            <a href="linux/reminders.sh">reminders</a>
          </li>

          <li>
            <a href="linux/bash_aliases">aliases</a>
          </li>
        </ul>
        should be available. Everything else is unavailable.
      </p>
    </div>
  );
}

export default App;
