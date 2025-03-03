[![codecov](https://codecov.io/gh/tomjtoth/tomjtoth.github.io/graph/badge.svg?token=417607S3E8)](https://codecov.io/gh/tomjtoth/tomjtoth.github.io)

# About

These tools are accessible from a browser without requiring a login.

## TODO

- **TESTS!** As indicated by the current coverage percentage shown in the badge above. Roadmap:
  - [ ] Achieve 30% coverage by Jun 1, 2025
  - [ ] Achieve 60% coverage by Jan 1, 2026
  - [ ] Achieve 90% coverage by Jun 1, 2026

## Development

Using git LFS for audio resources, clone using the below commands:

```sh
git clone https://github.com/tomjtoth/tomjtoth.github.io
cd tomjtoth.github.io
git lfs install
git lfs pull
```

### Dynamic Imports (Assets, Libraries)

The base `app-[hash].js` file size has been maintained at approximately 400kB.

### Persistent Storage

All reducers have been migrated from localStorage to Dexie.js (IndexedDB).

### Cache

The [service worker](./src/sw.ts) is configured to serve cached responses for all requests, relying on the browser to handle cache updates.

## Arch Linux

The files located [here](./public/linux/) are for personal use. I use the following script when migrating to new machines:

```sh
bash <(curl -L ttj.hu/linux/clonefig.sh)
```

These [aliases](./public/linux/bash_aliases) are also sourced from a few machines.
