"""Original 30 s electronic soundtrack for the araz.me reel (128 BPM, A minor).

Structure (bars of 1.875 s) is locked to the video timeline in reel.html:
  0-1  intro   pad + typing clicks           (scene 1: question typed)
  2-3  groove  kick, hats, pumping bass       (scene 2: question -> map)
  4-5  build   + clap, riser, snare roll      (scene 3: portrait)
  6-9  DROP    full beat, rolling bass, lead  (scene 4: stats)
  10-12 ride   beat + arp, whooshes on cards  (scene 5: products)
  13-15 outro  impact, pad, filtered beat out (scene 6: call to action)
Usage: python music.py out.wav
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 128
B = 60 / BPM          # beat
BAR = 4 * B
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

QUESTION = "کدام محله‌ها به بیمارستان دسترسی ندارند؟"  # must match reel.html
TYPE_START, TYPE_SPAN = 0.35, 2.4


def mtof(m):
    return 440 * 2 ** ((m - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def saw(freq, n, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * freq + phase) % 1) - 1


def add(bus, sig, at):
    i = int(at * SR)
    if i >= len(bus):
        return
    j = min(len(bus), i + len(sig))
    bus[i:j] += sig[: j - i]


def env(n, a=0.005, d=0.2, s=0.0, r=0.05, hold=None):
    t = np.arange(n) / SR
    e = np.where(t < a, t / a, s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    if hold is not None:
        e = e * np.clip((hold + r - t) / r, 0, 1)
    return e


# ---------------------------------------------------------------- instruments
def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.22)
    click = hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.003) * 0.4
    return np.tanh(1.6 * (body + click))


def clap():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    noise = bp(rng.standard_normal(n), 900, 4500)
    e = np.zeros(n)
    for k, off in enumerate((0, 0.011, 0.022)):
        e += np.where(t >= off, np.exp(-(t - off) / (0.006 if k < 2 else 0.12)), 0)
    return noise * e * 0.6


def hat(length=0.04, open_=False):
    n = int((0.25 if open_ else length) * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-t / (0.08 if open_ else 0.012)) * 0.35


def tick():
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return bp(rng.standard_normal(n), 2000, 6000) * np.exp(-t / 0.004) * 0.5


def supersaw(m, dur, voices=7, detune=0.18, cutoff=2500):
    n = int(dur * SR)
    out = np.zeros(n)
    for v in range(voices):
        cents = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune * 100
        out += saw(mtof(m) * 2 ** (cents / 1200), n, rng.random())
    return lp(out / voices, cutoff)


def bass_note(m, dur, cutoff=700):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = 0.6 * saw(mtof(m), n) + 0.8 * np.sin(2 * np.pi * mtof(m) * t)
    return lp(s, cutoff) * env(n, 0.004, 0.12, 0.55, 0.02, hold=dur - 0.02)


def pluck(m, dur=0.22, cutoff=5000):
    n = int(dur * SR)
    s = saw(mtof(m), n) * 0.6 + saw(mtof(m) * 1.005, n) * 0.4
    return lp(s, cutoff) * env(n, 0.002, 0.09)


def impact():
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (40 + 40 * np.exp(-t / 0.08)) * t) * np.exp(-t / 0.6)
    crash = hp(rng.standard_normal(n), 2500) * np.exp(-t / 0.7) * 0.25
    return np.tanh(1.4 * boom) * 0.9 + crash


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = t / dur
    noise = rng.standard_normal(n)
    # sweep a band-pass upward in chunks
    out = np.zeros(n)
    chunks = 48
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        fc = 300 * (40 ** (c / chunks))
        out[a:b] = bp(noise[a:b], fc * 0.7, min(fc * 1.4, 18000))
    tone = saw(1, n) * 0  # placeholder for shape
    f = 110 * 2 ** (3 * x)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return (out * 0.8 + tone) * x ** 2


def whoosh(dur=0.45):
    n = int(dur * SR)
    x = np.arange(n) / n
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    chunks = 16
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        fc = 600 * (12 ** (c / chunks))
        out[a:b] = bp(noise[a:b], fc * 0.6, min(fc * 1.6, 18000))
    return out * np.sin(np.pi * x) ** 2 * 0.35


def reverb(x, secs=1.8, mix=1.0):
    n = int(secs * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / (secs / 5))
    ir = lp(ir, 6000)
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n
    nfft = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return y * mix


# ---------------------------------------------------------------- arrangement
CHORDS = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]]  # Am F C G
ROOTS = [33, 29, 36, 31]


def bar_t(b):
    return b * BAR


def build():
    drums = np.zeros(N)
    bass = np.zeros(N)
    pad = np.zeros(N)
    lead = np.zeros(N)
    fx = np.zeros(N)
    send = np.zeros(N)
    side = np.ones(N)  # sidechain gain

    K, C = kick(), clap()

    def kick_at(t, gain=1.0):
        add(drums, K * gain, t)
        i = int(t * SR)
        L = int(0.28 * SR)
        j = min(N, i + L)
        if i < N:
            shape = 1 - 0.75 * np.exp(-np.arange(j - i) / SR / 0.09)
            side[i:j] = np.minimum(side[i:j], shape)

    # typing clicks (scene 1)
    for i in range(len(QUESTION)):
        if QUESTION[i] == " ":
            continue
        add(fx, tick() * (0.7 + 0.3 * rng.random()), TYPE_START + i * TYPE_SPAN / len(QUESTION))

    # pad throughout (gets brighter), chords per bar
    for b in range(16):
        ch = CHORDS[b % 4]
        cutoff = {0: 900, 1: 1100, 2: 1500, 3: 1700, 4: 2000, 5: 2600}.get(b, 3200 if b < 13 else 1600)
        vol = 0.22 if b < 6 else 0.16
        if b >= 13:
            vol = 0.24
        for m in ch:
            s = supersaw(m, BAR + 0.05, cutoff=cutoff) * env(int((BAR + 0.05) * SR), 0.02, 9, 1, 0.05, hold=BAR)
            add(pad, s * vol, bar_t(b))
            if b >= 6 and b < 13:  # octave layer in the drop
                add(pad, supersaw(m + 12, BAR, cutoff=4000) * 0.06, bar_t(b))
        # sub drone in intro
        if b < 2:
            n = int(BAR * SR)
            add(bass, np.sin(2 * np.pi * mtof(ROOTS[b % 4] + 12) * np.arange(n) / SR) * 0.25 * env(n, 0.3, 9, 1, 0.1, hold=BAR - 0.1), bar_t(b))

    # drums
    for b in range(2, 16):
        t0 = bar_t(b)
        if b == 5:  # build bar: kicks on 1..2, then snare roll
            for k in range(4):
                kick_at(t0 + k * B, 0.9)
            steps = [(0, 2), (2, 4), (3, 8)]
            for beat, div in steps:
                for s in range(div):
                    tt = t0 + beat * B + s * B / div
                    add(drums, C * (0.3 + 0.7 * (tt - t0) / BAR), tt)
            continue
        if b >= 14:  # outro: kick only on bar 14, then nothing
            if b == 14:
                for k in range(4):
                    kick_at(t0 + k * B, 0.5)
            continue
        for k in range(4):
            kick_at(t0 + k * B)
            add(drums, hat(open_=True) * 0.6, t0 + k * B + B / 2)
        if b >= 4:
            add(drums, C, t0 + B)
            add(drums, C, t0 + 3 * B)
        if b >= 6:
            for s in range(16):
                if s % 2:
                    add(drums, hat() * 0.7, t0 + s * B / 4)
        if b == 13:
            pass

    # bass
    for b in range(2, 14):
        r = ROOTS[b % 4]
        t0 = bar_t(b)
        if b < 6 or b >= 10:
            for k in range(4):  # off-beat pumping
                add(bass, bass_note(r + 12, B / 2 - 0.01) * 0.55, t0 + k * B + B / 2)
        else:  # rolling 16ths in the drop
            for s in range(16):
                if s % 4 == 0:
                    continue
                m = r + 12 + (12 if s % 4 == 3 else 0)
                add(bass, bass_note(m, B / 4 - 0.01, cutoff=1100) * 0.55, t0 + s * B / 4)

    # lead: arp in drop (bars 6-9) and lighter in 10-12
    arp = [0, 1, 2, 1, 2, 0, 2, 1]
    for b in range(6, 13):
        ch = CHORDS[b % 4]
        t0 = bar_t(b)
        for s in range(16):
            m = ch[arp[s % 8]] + 12 + (12 if s % 8 >= 6 else 0)
            g = 0.26 if b < 10 else 0.15
            p = pluck(m, cutoff=6000 if b < 10 else 3500) * g
            add(lead, p, t0 + s * B / 4)
            add(send, p * 0.6, t0 + s * B / 4)
    # drop hook (long notes on top)
    hook = [(0, 76, 1.5), (1.5, 74, 0.5), (2, 72, 1), (3, 71, 1)]
    for b in range(6, 10):
        for off, m, d in hook:
            mm = m if b % 2 == 0 else m - 2 + (b % 4 == 3) * 2
            n = int(d * B * SR)
            s = (saw(mtof(mm), n) + saw(mtof(mm) * 1.008, n)) * 0.5
            s = lp(s, 3500) * env(n, 0.01, 0.4, 0.6, 0.05, hold=d * B - 0.05) * 0.12
            add(lead, s, bar_t(b) + off * B)
            add(send, s, bar_t(b) + off * B)

    # FX
    add(fx, impact() * 0.8, bar_t(2))
    add(fx, riser(BAR * 2 - 0.05) * 0.5, bar_t(4))
    add(fx, impact(), bar_t(6))
    add(fx, impact() * 0.9, bar_t(13))
    for b in (10, 11, 12):  # product cards whoosh in
        add(fx, whoosh(), bar_t(10) + (b - 10) * 3 * B - 0.35)
    add(fx, whoosh(), bar_t(10) + 9 * B - 0.35)
    for k in range(5):  # stat slams
        add(fx, whoosh(0.3) * 0.7, bar_t(6) + k * 3 * B - 0.25)
    add(fx, whoosh(0.6), bar_t(8) - 0.0)  # mid-drop sparkle
    # final logo hit
    add(fx, impact() * 0.6, bar_t(15) - 0.0)

    add(send, pad * 0.5, 0)
    add(send, drums * 0.12, 0)

    # outro filter: dull the pad gradually in last 2 bars
    mix = drums * 0.9 + bass * side * 0.9 + pad * side * 0.9 + lead * (0.6 + 0.4 * side) + fx * 0.8
    mix += reverb(send, 2.2) * 0.35
    t = np.arange(N) / SR
    # section dynamics: hold the groove/build back so the drop hits harder
    sec = np.interp(t, [0, bar_t(2), bar_t(5.5), bar_t(6) - 0.01, bar_t(6), DUR], [0.9, 0.62, 0.72, 0.72, 1.0, 1.0])
    mix *= sec
    # fade out last 1.2s
    mix *= np.clip((DUR - t) / 1.2, 0, 1)
    mix = np.tanh(mix * 1.3)
    mix /= np.max(np.abs(mix)) * 1.12
    return mix


def write(path, mono):
    l = mono
    # tiny stereo widening via delayed copy of highs
    d = int(0.012 * SR)
    wide = hp(mono, 1500)
    r = mono.copy()
    r[d:] = mono[d:] - 0.25 * wide[:-d] + 0.25 * wide[d:]
    st = np.stack([l, r], 1)
    st /= np.max(np.abs(st)) * 1.12
    pcm = (st * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    write(sys.argv[1] if len(sys.argv) > 1 else "music.wav", build())
