# Baseline 🌅

**A new tab replacement that gives financially-aware developers 
a 10-second briefing on the state of the world; before 
everything else starts competing for their attention.**

<img width="1596" height="807" alt="Baseline" src="https://github.com/user-attachments/assets/f4d2c212-6a23-4ffe-b06c-3d6850feae99" />



<p align="center">
  <br />
  <strong>🔗 Try it out live:</strong>
  <br /><br />
  <a href="https://baselineboard.netlify.app/" target="_blank" rel="noopener noreferrer">
    <strong>🚀 👉 Open Baseline Live Dashboard 👈 🌅</strong>
  </a>
</p>


---
## Why Baseline Exists

Momentum has 3 million users and charges $2.99/month. Its core 
promise is intention-setting: a beautiful background, a clock, 
and a space to write your daily focus. It is, by design, 
disconnected from the world outside your goals.

Baseline is the opposite bet.

The developers, analysts, and globally-minded professionals 
who open their laptops before 8 am don't just need a motivational 
quote. They need to know what happened overnight. Did the market 
swing? Is the air quality acceptable enough to run before work? 
What's the dollar doing against their local currency? How much 
daylight is actually left?

These are not productivity questions. They are **situational 
awareness questions** and no new tab dashboard was built to 
answer them. Until this one.

---

## What It Shows

Every time you open a new tab, Baseline assembles a live 
snapshot from six independent data sources:

| Layer | Data | Source |
|-------|------|--------|
| 🖼️ **Background** | Random landscape photograph | Unsplash |
| ⏰ **Time** | Live local time, updates every second | `Date` API |
| 💬 **Quote** | Rotating inspirational or technology quote | Quotable.io |
| 🌤️ **Weather** | Current conditions + city name | OpenWeatherMap |
| 🌬️ **Air Quality** | AQI index with 5-level classification | OpenWeatherMap |
| 🌅 **Sun Times** | Today's sunrise and sunset for your location | Sunrise-Sunset.org |
| 💰 **Crypto** | Live price, 24h high/low for two coins (toggle) | CoinGecko |
| 😱 **
Fear & Greed** | Market sentiment index (0-100) | Alternative.me |
| 💱 **Exchange Rates** | USD vs EUR, GBP, KES | Open Exchange Rates |

No account. No login. No data sent anywhere. 
Everything is fetched fresh on every load.

---

## Architecture

Three files. Six external APIs. Zero dependencies.
baseline/

├── index.html    — structure and layout

├── index.css     — visual layer, text shadows, responsive layout

└── index.js      — all data fetching, DOM updates, state

The entire application is a single JavaScript file making 
parallel fetch requests. There is no bundler, no framework, 
no build step, and no npm. The only dependency is a browser.

---

## Data Fetching Strategy

All six API calls fire **independently and in parallel** on 
page load. They do not wait for each other. This is a 
deliberate choice:

```javascript
// Each fetch is independent — a slow coin API
// doesn't delay your weather from rendering
fetch("https://api.quotable.io/random")        // ~50ms
fetch("https://api.alternative.me/fng/")       // ~80ms
fetch("https://open.er-api.com/v6/latest/USD") // ~120ms
// weather + AQI + sun fire together from geolocation callback
```

If any single request fails, the rest of the dashboard 
continues rendering. Each fetch has its own `.catch()` 
handler that either shows a fallback value or fails 
silently, the user always sees a complete, functional 
dashboard regardless of which external services are slow 
or unavailable.

This is the same fault-tolerance pattern used in production 
microservices: **independent failure domains**.

---

## Error Handling Philosophy

Two categories of failure are treated differently:

**Recoverable (fallback shown):**
```javascript
// Background image — fallback to a known-good Unsplash URL
.catch(err => {
    document.body.style.backgroundImage = `url(https://...)`
    document.getElementById("author").textContent = `By: Dodi Achmad`
})
```

**Silent (console only):**
```javascript
// Market data — better to show nothing than show stale data
.catch(err => console.error(err))
```

The distinction matters: background and time are **structural**, the page looks broken without them. Financial data is 
**informational**, a blank widget is more honest than a 
cached number from three hours ago.

---

## State Management

The entire application has exactly one piece of mutable state:

```javascript
let currentCoinIndex = 0  // 0 = Dogecoin, 1 = Bitcoin
```

Toggling between coins is a single array lookup:

```javascript
function toggleCoin() {
    currentCoinIndex = currentCoinIndex === 0 ? 1 : 0
    fetchCoin(coins[currentCoinIndex])
}
```

There is no `localStorage`, no session storage, no state 
library. The dashboard resets to Dogecoin on every new tab, intentionally, because it is a **briefing tool**, not a 
persistent application. Persistence would imply history. 
Baseline has no memory by design.

---

## Geolocation Strategy

Weather, air quality, and sunrise/sunset all depend on 
coordinates. Rather than firing three separate geolocation 
requests, all three fetches are nested inside a single 
`navigator.geolocation.getCurrentPosition` callback:

```javascript
navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude

    fetch(`...weather?lat=${lat}&lon=${lon}`)     // request 1
    fetch(`...air_pollution?lat=${lat}&lon=${lon}`) // request 2
    fetch(`...sunrise-sunset...?lat=${lat}&lng=${lon}`) // request 3
})
```
One permission prompt. One coordinate resolution. 
Three data sources. This matters on mobile, especially 
repeated geolocation calls drain battery and increase 
latency noticeably.

---

## The Fear & Greed Meter

The most visually distinctive element is a progress bar 
that is based on market sentiment, is built entirely 
from a CSS `width` set inline from API data:

```javascript
// The bar width IS the fear/greed value (0-100)
`<span class="fear-greed-bar" style="width: ${value}%"></span>`
```

No canvas. No SVG. No chart library. A single CSS transition 
handles the animation:

```css
.fear-greed-bar {
    transition: width 0.6s ease;
}
```

This is a pattern worth knowing: **data-driven CSS** using 
inline style injection is often the right level of complexity 
for a single dynamic value. Reaching for a charting library 
here would be engineering for its own sake.

---

## What This Project Demonstrates

**Parallel async programming without async/await**
Six concurrent API calls using Promise chains — understanding 
`.then()` and `.catch()` as composable units rather than 
syntactic sugar for `await`.

**Fault-tolerant UI**
Independent failure domains mean no single API outage 
can break the user experience. Each widget owns its 
own error state.

**Data-driven rendering without a framework**
All DOM updates are targeted and surgical,
`getElementById` + `innerHTML` or `textContent`. No 
virtual DOM, no re-render cycle, no component tree.

**Geolocation as a data bus**
Using a single position callback to feed three dependent 
API calls eliminate redundant permission requests and 
coordinates three data sources on a single async event.

**State minimalism**
One mutable variable for the coin toggle. Everything 
else is derived from API responses at render time.
Zero stale state.

---

## Built With

- **HTML5** — semantic structure, no divitis
- **CSS3** — `text-shadow` depth layering, flexbox layout, 
              inline data-driven bar chart
- **Vanilla JavaScript** — Fetch API, Promise chains, 
                            `setInterval`, Geolocation API, 
                            `Date` API
- **Zero dependencies** — no npm, no bundler, no framework

**Six external APIs (all free, no key required except 
Unsplash via Scrimba proxy):**
- [Unsplash](https://unsplash.com/developers) — photography
- [Quotable.io](https://quotable.io) — quotes
- [OpenWeatherMap](https://openweathermap.org/api) — weather + AQI
- [Sunrise-Sunset.org](https://sunrise-sunset.org/api) — sun times
- [CoinGecko](https://coingecko.com/api) — crypto prices
- [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) — fear & greed
- [Open Exchange Rates](https://open.er-api.com) — forex

---

## Roadmap

| Feature | Complexity | Why |
|---------|------------|-----|
| **Local inflation rate** | Low — World Bank API, free | Ties directly to the financial awareness thesis |
| **Keyboard shortcut panel** | Low — `keydown` listener | Power-user layer, no UI clutter |
| **Offline fallback** | Medium — `localStorage` cache with timestamps | Show last-known data when network is unavailable |
| **User-configurable currencies** | Medium — `localStorage` for preferences | KES matters more to a Nairobi user than JPY |
| **Chrome extension packaging** | Low — `manifest.json` | Makes it an actual new tab replacement |

The Chrome extension roadmap item is the one worth 
building next. Packaging this as a `manifest.json` 
extension with `"chrome_url_overrides": { "newtab": "index.html" }` 
turns it into a product that directly competes with 
Momentum — same distribution channel, zero cost, 
open source.

---

| ⚽ **Live Scores** | World Cup 2026 fixtures, scores, and status | API-Sports |

## Why Live Scores Belong in a "Briefing, Not a Distraction" Tool

During a World Cup, the most common reason someone opens a new 
The tab isn't for writing a to-do list; it's for checking the score. 
Without Baseline, that means opening Twitter, getting hit by 
three unrelated trending topics, and resurfacing every twenty minutes. 
Having read nothing about the actual match.

Baseline answers the one question you actually had a score, 
status, who's playing, in the same glance as the time and 
weather, then gets out of the way. This is the same philosophy 
applied to global events instead of personal productivity: 
the information you were going to seek out anyway, delivered 
without the detour through everything competing for your 
attention along the way.

## Known Limitations

Being upfront about tradeoffs:

- **The football API key is exposed client-side.** This is a 
  vanilla JS app with no backend, so there's no way to call a 
  paid third-party API without the key being visible in the 
  browser's Network tab. For a personal dashboard run locally, 
  this is an acceptable tradeoff. For a public deployment, the 
  correct fix is a small serverless function (Cloudflare Worker 
  or Vercel Edge Function) that holds the key server-side and 
  proxies the request  listed on the roadmap below.
- **No request caching.** Every page load re-fetches all nine 
  data sources. For a personal new-tab page opened dozens of 
  times a day, this adds up in API quota. A `localStorage` 
  cache with a short TTL (5–10 minutes) would fix this without 
  adding any real complexity.
- **Free-tier rate limits.** The football fixtures endpoint in 
  particular has a low daily request ceiling on free plans — 
  worth checking against API-Sports' dashboard if fixtures stop 
  loading unexpectedly.

## Run Locally

No install required.

```bash
git clone https://github.com/SheillaO/baseline
cd baseline
open index.html
```

Or via Live Server (VS Code) if you want geolocation 
to work without the browser blocking it on `file://`.

---

**Sheilla O.**
Product-Minded Developer | Nairobi, Kenya 🇰🇪

Building the financial awareness layer that productivity tools forgot to include.

💼 [LinkedIn](https://www.linkedin.com/in/sheillaolga/) • 
🐙 [GitHub](https://github.com/SheillaO)

---

*Momentum tells you what you want to accomplish today.  Baseline tells you what the world looks like right now. Both matter. Only one existed.*


