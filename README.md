# About

These tools can be used from platforms without the need to log in.

## Custom solutions

### IndexedDB

All, but 2 reducers have been migrated to Dexie.js from localStorage. Sidepanel and battery-monitor both store simple enough data to be quickly (de-)serialized.

### Cache

[SW](./public/sw.js) intercepts requests:

- static assets are served from cache
- webpack generated .js and .css files are also refreshed along with the cached index.html when necessary
- the client gets responses from local cache if exists, and should be able to access new resources upon next request

## Arch Linux

I use the below script to install new machines:

```sh
bash <(curl -L ttj.hu/linux/clonefig.sh)
```

[Aliases](/public/linux/bash_aliases) are also sourced from a few machines.
