# About

These tools can be used from platforms without the need to log in.

### Development tools

- install gulp and its plugins as seen in the [deployment workflow](./.github/workflows/deploy.yml#L50)
- execute [`npx gulp`](./gulpfile.js) in a shell
  - to produce `/public/styles.css` (this will be deployed to `/assets/styles.css`)
  - and monitor for changes (`dx serve` does not recognize changes, as this is not using cache-busting atm)

## Custom solutions

The service worker can not intercept requests to resources via `HtmlAudioElement::new("path/to/mp3")` and `img { src="path/to/png" }` used in Dioxus, so currently the worker only populates the cache its opened from the client side manually.

<!--
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

I use the below script to install new machines:

```sh
bash <(curl -L ttj.hu/linux/clonefig.sh)
```

[Aliases](/public/linux/bash_aliases) are also sourced from a few machines.
