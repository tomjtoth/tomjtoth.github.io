[![codecov](https://codecov.io/gh/tomjtoth/tomjtoth.github.io/graph/badge.svg?token=417607S3E8)](https://codecov.io/gh/tomjtoth/tomjtoth.github.io)

# About

These tools can be used from a browser without the need to log in.

## TODO

- **TESTS!** As one can guess based on the shameful number in the above badge. Roadmap:
  - [ ] get 30% by Jun 1, 2025
  - [ ] get 60% by Jan 1, 2026
  - [ ] get 90% by Jun 1, 2026

## Custom solutions

### Dynamic imports (assets, libraries)

Managed to keep the size of the base `app-[hash].js` at around 400kB.

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
