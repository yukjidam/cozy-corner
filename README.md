# ceddy's cozy corner 🐾

This is my personal portfolio, but I didn't want it to feel like a typical portfolio. So instead it's a tiny cozy desktop you get to explore: draggable windows, a virtual pet you can hatch and take care of, a lofi radio with multiple stations, and a day/night toggle if you're not feeling the vibe.

**→ [cozy-corner-rho.vercel.app](https://cozy-corner-rho.vercel.app)**

## 🚀 v2.00 LIVE!

- Added new apps: Palette, TV, Slots, Terminal, Wallpaper
- Added new widgets: Haiku and Quotes
- Added visitor counter
- Upgraded Logs → Messages

## 👀 Sneak Peek

![Sneak peek of ceddy's cozy corner](https://github.com/yukjidam/yukjidam/blob/main/sneakpeek.png?raw=true)

## ✨ What's inside

- **A little desktop, just for fun.** Draggable, minimizable windows for about, links, work, faq, contact, and a logs page that doubles as a guestbook. Everything lives in a dock at the bottom — and yes, the whole thing works on mobile too (windows become bottom sheets, dock scrolls sideways, games are touch-friendly).
- **🥚 hatch & hold** — my favorite part. Tap an egg to hatch your creature, then keep it alive and happy. Feed it when it's hungry, play with it when it's bored, put it to sleep when it's tired, heal it when it gets sick. Stats decay over time, so don't neglect it for too long.

  Inside "play" there's a **fishing minigame**: a fish swims up and down a bar on the left. Hold down to raise the green catch zone, let go to drop it. Keep the zone over the fish to fill the catch meter — hit it 3 times before the timer runs out to win. Each catch makes the next round a little faster and trickier.

- **🎵 Cozy Radio** — a little corner station. Pick a folder and let it ride:
  - 🌙 chill lofi
  - 📚 study lofi
  - 🎷 jazz lofi
  - 🎤 hip hop lofi
  - ⭐ personal picks

  Comes with a playlist, shuffle and repeat, and a visualizer that reacts to whatever's playing.

- **Ambient background music** that fades in and out smoothly as you toggle it, with its own volume control and mute button tucked up in the corner.
- **🌗 Day and night themes**, whichever you prefer.
- **📋 Visitor log** — drop a note and it shows up in the log. I read every single one. 🐾

## 🛠️ How it's built

Just HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no dependencies to install. Everything runs straight in the browser.

A few pieces worth noting under the hood:

- **Canvas API** — the pet game renders entirely on a `<canvas>` element, pixel art and all
- **Web Audio API** — powers the music visualizer, reacting in real time to whatever's playing
- **CSS custom properties + class toggling** — day/night theming with smooth transitions throughout
- **Drag logic** — hand-rolled, no libraries. Windows track pointer/touch events and stay within viewport bounds
- **Bottom sheet pattern** — on mobile, draggable windows transform into swipeable bottom sheets using the same drag logic
- **Guestbook** — visitor notes are persisted and served externally, so they survive page refreshes

## 🐣 Easter eggs & little details

A few things you might not notice at first:

- The desktop has a **sticky note** with a to-do list (spoiler: *touch grass* is still pending ??).
- The dock labels animate on hover, and each icon has its own little personality.
- The creature's expressions change depending on its mood and stats — keep an eye on its face.
- The fishing minigame gets progressively harder the better you do.
- The FAQ has a question about favorite playlists. The answer is very on-brand.
- The "currently" section in about is... relatable.

## 👤 About the maker

Made by **Cedrick Abuluyan** — an aspiring programmer from the Philippines who likes building cozy little things on the internet. BSIT grad (STI College Global City, 2026). When not coding: probably making playlists, playing games with friends, or petting one of his 9 cats.

- 🐙 [github.com/yukjidam](https://github.com/yukjidam)
- 🐦 [x.com/jjangjorimzz](https://x.com/jjangjorimzz)
- 📸 [instagram.com/575.jpeg](https://www.instagram.com/575.jpeg/)
- ✉️ abuluyan.cedrick@gmail.com

---

Made with ☕ and probably too much love for tiny ui details.
