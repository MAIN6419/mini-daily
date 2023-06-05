import { getKST } from "./libray";

export async function askForCoords() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coordsObj = {
          latitude,
          longitude,
        };
        saveCoords(coordsObj);
        resolve(getWeather(latitude, longitude));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error("사용자가 위치 정보 동의를 거부했습니다!");
        } else {
          console.error("날씨 정보를 가져올 수 없습니다!", error);
        }
        reject(error);
      }
    );
  });
}

async function saveCoords(coordsObj) {
  localStorage.setItem("coords", JSON.stringify(coordsObj));
}

export async function getWeather(lat, lon) {
  const API_KEY = OPENWEATHERMAP_API_KEY;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const json = await response.json();
    const temperature = parseFloat(json.main.temp - 273.15).toFixed(1); // 온도
    const place = json.name; // 사용자 위치
    const humidity = json.main.humidity;
    const icon = json.weather[0].icon;
    const sunrise = json.sys.sunrise * 1000;
    const sunset = json.sys.sunset * 1000;
    const reloadTime = getCustomTime();
    const currentTime = getKST().getTime();
    let weatherText = json.weather[0].description;
    if (weatherText === "clear sky") {
      weatherText = "맑음";
    } else if (weatherText === "few clouds") {
      weatherText = "구름 조금";
    } else if (weatherText === "scattered clouds") {
      weatherText = "구름 낌";
    } else if (weatherText === "broken clouds"|| "overcast clouds") {
      weatherText = "흐림";
    } else if (weatherText === "shower Rain") {
      weatherText = "소나기";
    } else if (weatherText === "rain") {
      weatherText = "비";
    } else if (weatherText === "thunderstorm") {
      weatherText = "천둥";
    } else if (weatherText === "snow") {
      weatherText = "눈";
    } else if (weatherText === "mist") {
      weatherText = "안개";
    }

    const weatherInfo = {
      temp: temperature,
      place,
      humidity,
      icon,
      reloadTime,
      sunrise,
      sunset,
      weatherText: weatherText,
      currentTime,
    };
    localStorage.setItem("weather", JSON.stringify(weatherInfo));
    return weatherInfo;
  } catch (error) {
    console.log("Error fetching weather:", error);
  }
}

function getCustomTime() {
  const now = getKST();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let ampm = now.getHours() < 12 ? "오전" : "오후";
  hours = now.getHours() % 12 || 12;
  return `${ampm} ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}
