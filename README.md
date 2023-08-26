# Kuvaus

Tässä lähinnä itselleni staattiset sivustot, jotkut auttavat minua kaupassa. Selain riittää, ei tarvitse tunnistautua minnekään!

- [akunvalvonta](/index.html#/battery-monitor)
    - yksinkertainen työkalu joka näyttää ilmoituksia jos akun taso ois liian ylhäinen tai alhainen
- [ostoslista](/index.html#shopping-list)
    - kasaa ostettavia kamoja minimipanostuksella puoleltani
    - tutustu myös itse [ruokaohjeisiin](recipies/README.md)
- [tuotteet](products/README.md)
    - muistuttaa vältettävistä tuotteista
- [låttext](lyrics/README.md)
    - jag pluggar svenska på min fritid och lyssnar på där låtar

## Kehitys

Lisää alla kohta tiedostoon: `.vscode/launch.json`:

```json
{
    "type": "chrome",
    "request": "launch",
    "name": "open ./index.html in Chrome",
    "file": "${fileDirname}/index.html",
    "runtimeArgs": ["--disable-web-security"]
}
```
