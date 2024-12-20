# Kuvaus

Tässä lähinnä itselleni staattiset sivustot, jotkut auttavat minua kaupassa.

- [akunvalvonta](/index.html#/battery-monitor)
  - yksinkertainen työkalu joka näyttää ilmoituksia jos akun taso ois liian ylhäinen tai alhainen
- [ostoslista](/index.html#shopping-list)
  - kasaa ostettavia kamoja minimipanostuksella puoleltani
  - tutustu myös itse [ruokaohjeisiin](recipies/README.md)
- [tuotteet](products/README.md)
  - muistuttaa vältettävistä tuotteista
- [låttext](index.html#/lyrics)
  - jag pluggar svenska på min fritid och lyssnar på där låtar

## Kehitys

Lisää alla kohta tiedostoon: `.vscode/launch.json`:

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "open /index.html in Chrome",
  "file": "${workspaceFolder}/index.html",
  "runtimeArgs": ["--disable-web-security"]
}
```

## Arch Linux Clonefig

```sh
bash <(curl -L ttj.hu/linux/clonefig.sh)
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
