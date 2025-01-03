# About

These are downloaded from [here](https://www.sounds-resource.com/xbox/arxfatalis/sound/23538/) and coverted to mp3:

```sh
for f in *.wav; do ffmpeg -i $f -codec:a libmp3lame -b:a 128k "${f%.wav}.mp3"; done
```
