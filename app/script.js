const apiKey = "3c7828a18fb47cb5ffdcceccdae7bcec";
const cityInput = document.querySelector("#cityname");

// Prevent form reload
document
  .querySelector("#weatherForm")
  .addEventListener("submit", (e) => e.preventDefault());

cityInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = cityInput.value.trim();

    if (value !== "") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${apiKey}&units=metric`;
      getWeather(url, value);
    } else {
      alert("Please enter a city name.");
    }
  }
});

async function getWeather(url, value) {
  document.querySelector(".heading2")?.remove();
  document.querySelector("ul")?.remove();

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) throw new Error("City not found");

    // AQI API call
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const aqiRes = await fetch(aqiUrl);
    const aqiData = await aqiRes.json();
    const aqiValue = aqiData.list[0].main.aqi;

    let airQuality = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][
      aqiValue - 1
    ];

    // Create new elements
    let newh2 = document.createElement("h2");
    newh2.className = "heading2";
    newh2.innerText = `Location : ${value}`;

    let newul = document.createElement("ul");
    newul.innerHTML = `
          <li><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon"></li>
          <li>Temperature: ${data.main.temp}°C</li>
          <li>Humidity: ${data.main.humidity}%</li>
          <li>Wind Speed: ${data.wind.speed} m/s</li>
          <li>Sun Condition: ${data.weather[0].description}</li>
          <li>Pressure: ${data.main.pressure} hPa</li>
          <li>Air Quality Index: ${airQuality}</li>
        `;

    document.querySelector(".box2").append(newh2, newul);
  } catch (err) {
    let errorText = document.createElement("p");
    errorText.className = "heading2";
    errorText.innerText = "⚠️ City not found!";
    document.querySelector(".box2").appendChild(errorText);
  }
}
