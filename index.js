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
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("weather").innerHTML = `
            <img src=${iconUrl} />
            <p class="weather-temp">${Math.round(data.main.temp)}º</p>
            <p class="weather-city">${data.name}</p>
        `;
  } catch (err) {
    console.error(err);
  }

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

const matchContainer = document.getElementById("football-matches");

async function fetchWorldCupMatches() {
  try {
    const response = await fetch("/.netlify/functions/football");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    matchContainer.innerHTML = "";

    if (!data.matches) {
      matchContainer.innerHTML = "<p>No upcoming matches found.</p>";
      return;
    }

    const recentResults = data.matches
      .filter((match) => match.status === "FINISHED")
      .slice(-2);

    
    const upcomingMatches = data.matches
      .filter((match) => match.status !== "FINISHED")
      .slice(0, 1);

    
    if (recentResults.length > 0) {
      matchContainer.innerHTML += `<p class="match-section-title">📊 Recent Results</p>`;
      recentResults.forEach((match) => renderMatchCard(match));
    }

    if (upcomingMatches.length > 0) {
      matchContainer.innerHTML += `<p class="match-section-title">🔜 Upcoming</p>`;
      upcomingMatches.forEach((match) => renderMatchCard(match));
    }

    if (recentResults.length === 0 && upcomingMatches.length === 0) {
      matchContainer.innerHTML = "<p>No matches found.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    matchContainer.innerHTML =
      "<p>Error loading matches. Please check your API key.</p>";
  }
}


function renderMatchCard(match) {
  const homeTeam = match.homeTeam;
  const awayTeam = match.awayTeam;
  const status = match.status;
  const homeScore = match.score?.fullTime?.home ?? "-";
  const awayScore = match.score?.fullTime?.away ?? "-";

  matchContainer.innerHTML += `
            <div class="match-card">
                <div class="team">
                    <img src="${homeTeam.crest}" alt="${homeTeam.name}" width="30" />
                    <span>${homeTeam.name}</span>
                </div>
                <div class="score-status">
                    <span class="score">${homeScore} - ${awayScore}</span>
                    <span class="status-badge">${status}</span>
                </div>
                <div class="team">
                    <img src="${awayTeam.crest}" alt="${awayTeam.name}" width="30" />
                    <span>${awayTeam.name}</span>
                </div>
            </div>
        `;
}

fetchWorldCupMatches();