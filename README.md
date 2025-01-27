# About

These are mostly static websites and other tools I use from different machines without bothering to log in anywhere.

## Migration in Progress

The TypeScript version still contains a few bugs, giving Rust (+ WASM via Dioxus) another try.

### DevTools

- install gulp and its plugins as seen in the [deployment workflow](./.github/workflows/deploy.yml#L53)
- execute [`npx gulp`](./gulpfile.js) in a shell
  - to produce `/public/styles.css` (this will be deployed to `/assets/styles.css`)
  - and monitor for changes (`dx serve` does not recognize changes, as this is not using cache-busting atm)

<!--
## Custom solutions

### IndexedDB

All, but 2 reducers have been migrated to Dexie.js from localStorage. Sidepanel and battery-monitor both store simple enough data to be quickly (de-)serialized.

### Cache

[SW](./public/service-worker.js) intercepts requests:

- the app's core resources are cached during the install event (1st page visit)
- the Arx minigame's assets are cached once, and served always from cache later
  - upon 2nd visit to the website, as importing App is faster than registering the service-worker
- webpack generated .js and .css files are also refreshed along with the cached index.html when necessary
- the client gets responses from local cache if exists, and should be able to access new resources upon next request
 -->

## Arch Linux

I used to hop distros, then tried installing Arch on anything that hums ever since 2009, this is the current version:

```sh
bash <(curl -L ttj.hu/linux/clonefig.sh)
```

[Aliases](/public/linux/bash_aliases) are also sourced from a few friends' machines.
