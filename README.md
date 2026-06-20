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


