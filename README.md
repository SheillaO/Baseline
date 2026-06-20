# Baseline 🌅

**A new tab replacement that gives financially-aware developers 
a 10-second briefing on the state of the world; before 
everything else starts competing for their attention.**

---
## Why Baseline Exists

Momentum has 3 million users and charges $2.99/month. Its core 
promise is intention-setting: a beautiful background, a clock, 
and a space to write your daily focus. It is, by design, 
disconnected from the world outside your goals.

Baseline is the opposite bet.

The developers, analysts, and globally-minded professionals 
who open their laptops before 8am don't just need a motivational 
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
silently — the user always sees a complete, functional 
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

The distinction matters: background and time are **structural** 
— the page looks broken without them. Financial data is 
**informational** — a blank widget is more honest than a 
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
library. The dashboard resets to Dogecoin on every new tab 
— intentionally, because it is a **briefing tool**, not a 
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


