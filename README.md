# About

These tools can be used from a browser without the need to log in.

## Custom solutions

### Persistent storage

All reducers have been migrated to Dexie.js (Indexed DB) from localStorage.

### Cache

The [service-worker](./src/sw.ts) intercepts requests and serves them from cache directly if the resource is not of `[name]-[hash].[ext]`; otherwise fetches from the network and updates the cache, removing outdated versions based on hash.

## Arch Linux

The files [here](./public/linux/) are for personal use, I use the below script when migrating to new machines:

```sh
bash <(curl -L ttj.hu/linux/clonefig.sh)
```

[Aliases](/public/linux/bash_aliases) are also sourced from a few machines.
