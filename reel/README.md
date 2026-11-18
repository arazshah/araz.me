# araz.me promo reel

A 30 s vertical (1080×1920, 30 fps) promo reel built from the site's content, with an original soundtrack.

```bash
pip install numpy scipy
python reel/music.py reel/out/music.wav                               # soundtrack (128 BPM)
cd reel && node render.js video out/araz-reel.mp4 @your_instagram     # with music
node render.js video out/araz-reel-silent.mp4                         # no audio (add Instagram music in-app)
node render.js stills out/stills 3 10 15                              # preview frames
```
Open `reel.html?play` through any local web server to preview it live. Fonts: Vazirmatn (OFL).
