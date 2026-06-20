try {
  const res = await fetch(
    "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature",
  );
  const data = await res.json();
  document.body.style.backgroundImage = `url(${data.urls.regular})`;
  document.getElementById("author").textContent = `By: ${data.user.name}`;
} catch (err) {
  document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
)`;
  document.getElementById("author").textContent = `By: Dodi Achmad`;
}

const coins = ["dogecoin", "bitcoin"];
let currentCoinIndex = 0;

async function fetchCoin(coinId) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    if (!res.ok) {
      throw Error("Something went wrong");
    }
    const data = await res.json();

    document.getElementById("crypto-top").innerHTML = `
            <img src=${data.image.small} />
            <span>${data.name}</span>
        `;

    // FIXED: writes to its own div with "=" instead of appending to the
    // parent #crypto with "+=" — the old version stacked duplicate price
    // paragraphs every time you toggled coins.
    document.getElementById("crypto-prices").innerHTML = `
            <p>🎯: $${data.market_data.current_price.usd.toLocaleString()}</p>
            <p>👆: $${data.market_data.high_24h.usd.toLocaleString()}</p>
            <p>👇: $${data.market_data.low_24h.usd.toLocaleString()}</p>
        `;
  } catch (err) {
    console.error(err);
  }
}

function toggleCoin() {
  currentCoinIndex = currentCoinIndex === 0 ? 1 : 0;
  fetchCoin(coins[currentCoinIndex]);
}

// FIXED: button now lives as static HTML (see index.html below) and gets
// wired up here with addEventListener. Inline onclick="" attributes don't
// work with <script type="module"> — module-scoped functions aren't
// attached to window the way they are in a normal script.
document.getElementById("coin-toggle").addEventListener("click", toggleCoin);

fetchCoin(coins[currentCoinIndex]);

function getCurrentTime() {
  const date = new Date();
  document.getElementById("time").textContent = date.toLocaleTimeString(
    "en-us",
    { timeStyle: "short" },
  );
}

setInterval(getCurrentTime, 1000);

// FIXED: weather, air quality, and sunrise/sunset all now share ONE
// geolocation callback and ONE lat/lon pair. Previously, air quality and
// sunrise/sunset were separate top-level fetches referencing variables
// that only existed inside this callback — that threw a ReferenceError
// which silently stopped every statement after it in the whole file.
navigator.geolocation.getCurrentPosition(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Weather
  try {
    const res = await fetch(
      `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial`,
    );
    if (!res.ok) {
      throw Error("Weather data not available");
    }
    const data = await res.json();
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("weather").innerHTML = `
            <img src=${iconUrl} />
            <p class="weather-temp">${Math.round(data.main.temp)}º</p>
            <p class="weather-city">${data.name}</p>
        `;
  } catch (err) {
    console.error(err);
  }

  // Air quality (moved inside, now uses local lat/lon)
  try {
    const res = await fetch(
      `https://apis.scrimba.com/openweathermap/data/2.5/air_pollution?lat=${lat}&lon=${lon}`,
    );
    const data = await res.json();
    const aqiLabels = {
      1: { label: "Good", emoji: "😊" },
      2: { label: "Fair", emoji: "🙂" },
      3: { label: "Moderate", emoji: "😐" },
      4: { label: "Poor", emoji: "😷" },
      5: { label: "Very Poor", emoji: "🤢" },
    };
    const aqiInfo = aqiLabels[data.list[0].main.aqi];
    document.getElementById("aqi").textContent =
      `${aqiInfo.emoji} Air: ${aqiInfo.label}`;
  } catch (err) {
    console.error(err);
  }

  // Sunrise/sunset (moved inside, now uses local lat/lon)
  try {
    const res = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`,
    );
    const data = await res.json();
    const sunrise = new Date(data.results.sunrise);
    const sunset = new Date(data.results.sunset);
    const fmt = { hour: "2-digit", minute: "2-digit" };
    document.getElementById("sun-times").textContent =
      `🌅 ${sunrise.toLocaleTimeString("en-us", fmt)}  ·  🌇 ${sunset.toLocaleTimeString("en-us", fmt)}`;
  } catch (err) {
    console.error(err);
  }
});

fetch("https://api.quotable.io/random?tags=inspirational|technology|success")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("quote").innerHTML = `
            <p class="quote-text">"${data.content}"</p>
            <p class="quote-author">— ${data.author}</p>
        `;
  })
  .catch((err) => {
    document.getElementById("quote").innerHTML = `
            <p class="quote-text">"The best time to start was yesterday. The next best time is now."</p>
        `;
  });

fetch("https://api.alternative.me/fng/")
  .then((res) => res.json())
  .then((data) => {
    const value = data.data[0].value;
    const label = data.data[0].value_classification;

    const sentimentEmoji = {
      "Extreme Fear": "😱",
      Fear: "😨",
      Neutral: "😐",
      Greed: "😏",
      "Extreme Greed": "🤑",
    };

    const emoji = sentimentEmoji[label] || "📊";

    document.getElementById("fear-greed").innerHTML = `
            <p class="fear-greed-label">${emoji} ${label}</p>
            <p class="fear-greed-bar-wrap">
                <span class="fear-greed-bar" style="width: ${value}%"></span>
            </p>
        `;
  })
  .catch((err) => console.error(err));

fetch("https://open.er-api.com/v6/latest/USD")
  .then((res) => res.json())
  .then((data) => {
    const currencies = ["EUR", "GBP", "KES"];

    let ratesHTML = `<p class="fx-title">💱 USD</p>`;

    currencies.forEach((currency) => {
      const rate = data.rates[currency];
      ratesHTML += `<p class="fx-row">${currency}: ${rate.toFixed(2)}</p>`;
    });

    document.getElementById("fx-rates").innerHTML = ratesHTML;
  })
  .catch((err) => {
    document.getElementById("fx-rates").innerHTML =
      `<p class="fx-title">💱 FX unavailable</p>`;
  });

// ⚠️ SECURITY NOTE: this key is visible to anyone who views page source or
// opens DevTools → Network tab. That's a known limitation of calling a
// paid third-party API directly from client-side JS with no backend.
// Rotate this key in your API-Sports dashboard before pushing this
// publicly — the one below is now exposed and should be treated as burned.
const API_KEY = "c9b28b867e47748d45e03099bd52cb82"; // ⚠️ rotate this

const BASE_URL = "https://v3.football.api-sports.io";
const matchContainer = document.getElementById("football-matches");

async function fetchWorldCupMatches() {
  try {
    const response = await fetch(`${BASE_URL}/fixtures?league=1&season=2026`, {
      method: "GET",
      headers: {
        // FIXED: calling v3.football.api-sports.io DIRECTLY needs a single
        // "x-apisports-key" header. "x-rapidapi-host"/"x-rapidapi-key" only
        // work when your fetch URL points at a rapidapi.com gateway domain
        // instead — mixing the two causes a 401/403 even with a valid key.
        "x-apisports-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const fixtures = data.response;

    matchContainer.innerHTML = "";

    if (fixtures.length === 0) {
      matchContainer.innerHTML = "<p>No matches found for this tournament.</p>";
      return;
    }

    fixtures.forEach((match) => {
      const homeTeam = match.teams.home;
      const awayTeam = match.teams.away;
      const goals = match.goals;
      const status = match.fixture.status.short;

      const homeScore = goals.home !== null ? goals.home : "-";
      const awayScore = goals.away !== null ? goals.away : "-";

      matchContainer.innerHTML += `
                <div class="match-card">
                    <div class="team">
                        <img src="${homeTeam.logo}" alt="${homeTeam.name}" width="30" />
                        <span>${homeTeam.name}</span>
                    </div>
                    <div class="score-status">
                        <span class="score">${homeScore} - ${awayScore}</span>
                        <span class="status-badge">${status}</span>
                    </div>
                    <div class="team">
                        <img src="${awayTeam.logo}" alt="${awayTeam.name}" width="30" />
                        <span>${awayTeam.name}</span>
                    </div>
                </div>
            `;
    });
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    matchContainer.innerHTML =
      "<p>Error loading matches. Please check your API key.</p>";
  }
}

fetchWorldCupMatches();
