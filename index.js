try {
    const res = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    const data = await res.json()
    document.body.style.backgroundImage = `url(${data.urls.regular})`
    document.getElementById("author").textContent = `By: ${data.user.name}`
} catch (err) {
    document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
)`
    document.getElementById("author").textContent = `By: Dodi Achmad`
}



const coins = ["dogecoin", "bitcoin"];
let currentCoinIndex = 0;

// Combined using your original DOM elements and async/await
async function fetchCoin(coinId) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    if (!res.ok) {
      throw Error("Something went wrong");
    }
    const data = await res.json();

    // Keeps your exact original original div targeting
    document.getElementById("crypto-top").innerHTML = `
            <img src=${data.image.small} />
            <span>${data.name}</span>
        `;
    // Restored your exact append style, but with beautiful .toLocaleString() pricing
    document.getElementById("crypto").innerHTML += `
            <p>🎯: $${data.market_data.current_price.usd.toLocaleString()}</p>
            <p>👆: $${data.market_data.high_24h.usd.toLocaleString()}</p>
            <p>👇: $${data.market_data.low_24h.usd.toLocaleString()}</p>
        `;
  } catch (err) {
    console.error(err);
  }
}

// Toggle function stays intact
function toggleCoin() {
  currentCoinIndex = currentCoinIndex === 0 ? 1 : 0;
  fetchCoin(coins[currentCoinIndex]);
}

// Initial fetch on page load
fetchCoin(coins[currentCoinIndex]);


function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", { timeStyle: "short" })
}

setInterval(getCurrentTime, 1000)

navigator.geolocation.getCurrentPosition(async position => {
    try {
        const res = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial`)
        if (!res.ok) {
            throw Error("Weather data not available")
        }
        const data = await res.json()
        const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        document.getElementById("weather").innerHTML = `
            <img src=${iconUrl} />
            <p class="weather-temp">${Math.round(data.main.temp)}º</p>
            <p class="weather-city">${data.name}</p>
        `
    } catch (err) {
        console.error(err)
    }
});

fetch(`https://apis.scrimba.com/openweathermap/data/2.5/air_pollution?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(res => res.json())
        .then(data => {
            const aqiLabels = {
                1: { label: "Good", emoji: "😊" },
                2: { label: "Fair", emoji: "🙂" },
                3: { label: "Moderate", emoji: "😐" },
                4: { label: "Poor", emoji: "😷" },
                5: { label: "Very Poor", emoji: "🤢" }
            }
            const aqi = data.list[0].main.aqi
            const aqiInfo = aqiLabels[aqi]
            document.getElementById("aqi").textContent = `${aqiInfo.emoji} Air: ${aqiInfo.label}`
        })
        .catch(err => console.error(err))


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

