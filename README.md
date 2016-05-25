# [Put.io-Chrome-Extension](https://chrome.google.com/webstore/detail/putio-extension/lmonmjokfiamaoddkeofepnapdldbejb)

Extension for put.io. Add torrent directly by right clicking, view your account informations
Browse your file, add transfers, manage options and storage.

Play videos from the app (with subtitles)

[Chrome Web Store Link](https://chrome.google.com/webstore/detail/putio-extension/lmonmjokfiamaoddkeofepnapdldbejb)

## [Coming Soon](todo.md)

## Code Fixes

### Bower Library Changes

#### video.js

CSS replace path `font` by `fonts`

#### angular-tree-control

CSS replace path `images` by `img`

#### parse-torrent-name

Better regex
``` Javascript
var patterns = {
    season: /([Ss]?([0-9]{1,2}))[Eex]/,
    episode: /([Eex]([0-9]{2})[^0-9])/,
    year: /([\[\(]?((?:19[0-9]|20[01])[0-9])[\]\)]?)/,
    resolution: /[0-9]{3,4}p/,
    quality: /(?:PPV\.)?[HP]DTV|(?:HD)?CAM|B[rR]Rip|TS|(?:PPV )?WEB-?DL(?: DVDRip)?|H[dD]Rip|DVDRip|DVDRiP|DVDRIP|CamRip|W[EB]B[rR]ip|BluRay|DvDScr/,
    codec: /xvid|x264|h\.?264/i,
    audio: /MP3|DD5\.?1|Dual[\- ]Audio|LiNE|DTS|AAC(?:\.?2\.0)?|AC3(?:\.5\.1)?/,
    group: /(- ?([^-]+(?:-={[^-]+-?$)?))$/,
    region: /R[0-9]/,
    extended: /EXTENDED/,
    hardcoded: /HC/,
    proper: /PROPER/,
    repack: /REPACK/,
    container: /MKV|AVI/,
    widescreen: /WS/,
    garbage: /1400Mb|3rd Nov| ((Rip))/
};
```
