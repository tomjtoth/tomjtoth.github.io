# About

These are mostly static websites and other tools I use from different machines without bothering to log in anywhere.

## Custom solutions

### Cache

[SW](./public/service-worker.js) intercepts requests:

- the app's core resources are cached during the install event (1st page visit)
- runes' assets are cached once, and served always from cache later
- webpack generated .js and .css files are also refreshed along with the cached index.html when necessary
- the client gets responses from local cache if exists, and should be able to access new resources upon next request

## Arch Linux

I used to hop distros, then tried installing Arch on anything that hums ever since 2009, this is the current version:

```sh
bash <(curl -L ttj.hu/linux/clonefig.sh)
```

[aliases](/public/linux/bash_aliases) are also sourced from a few friends' machines.
