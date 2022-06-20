var pastSearchOb = {};
var time = moment().format("hh:mm:ss");
var date = moment().format("dddd, DD MMMM YYYY");
var currentDay = moment().format("DD");
var currentMonthAndYear = moment().format("MM/YYYY");
var key = "4f0c6030f6d2d9877edaf94d9f399aa6";
var clearTheListBtn = document.getElementById("clearlist");
var pastCityEl = document.getElementById("archivecity");
var searchcityEl = document.getElementById("cityname");
var cityNowEl = document.getElementById("city-selected");
var submitButtonEl = document.getElementById("submitButton");
var iconNowEl = document.getElementById("icon-weather");
var tempNowEl = document.getElementById("temp-now");
var windNowEl = document.getElementById("wind-now");
var humidityNowEl = document.getElementById("humidity-now");
var uvNowEl = document.getElementById("uv-now");
var futureDayEl = document.getElementById("future-days");
var weatherData = {};
var city = "";

if (localStorage.getItem("pastSearch")) {
  showPast();
}

function showPast() {
  pastCityEl.innerHTML = "";
  if (JSON.parse(localStorage.getItem("pastSearch"))) {
    pastSearchOb = JSON.parse(localStorage.getItem("pastSearch"));
  }
  for (var i in pastSearchOb) {
    var pastCity = document.createElement("li");
    pastCity.textContent = i;
    pastCity.setAttribute("class", "previous");
    pastCityEl.appendChild(pastCity);
  }
}

pastCityEl.addEventListener("click", getpastCity);
function getpastCity(event) {
  futureDayEl.innerHTML = "";
  city = event.target.textContent;
  weatherCode(city);
}

clearTheListBtn.addEventListener("click", clearArchive);
function clearArchive() {
  localStorage.clear();
  pastCityEl.innerHTML = "";
  location.reload();
}

submitButtonEl.addEventListener("click", newCitySearch);
function newCitySearch(event) {
  event.preventDefault();
  if (searchcityEl.value) {
    futureDayEl.innerHTML = "";
    city = searchcityEl.value;
    weatherCode(city);
    searchcityEl.value = "";
  } else {
    alert("Invalid City Name!");
  }
}

function weatherCode(city) {
  var weatherSearch =
    "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + key;
  fetch(weatherSearch).then(function (response) {
    if (response.status === 200) {
      response.json().then(function (data) {
        weatherData.name = data[0].name;
        weatherData.lat = data[0].lat;
        weatherData.lon = data[0].lon;

        pastSearchOb[city] = weatherData;
        localStorage.setItem("pastSearch", JSON.stringify(pastSearchOb));

        getWeatherData(weatherData);
        displaypastSearch();
      });
    } else {
      alert("Error occurred, Invalid city name");
    }
  });
}

function getWeatherData(weatherData) {
  var weatherSearch =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    weatherData.lat +
    "&lon=" +
    weatherData.lon +
    "&appid=" +
    key +
    "&exclude=hourly&exclude=minutely&exclude=alerts&units=metric";
  fetch(weatherSearch).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        showWeather(data);
      });
    } else {
      alert("Error occurred, Invalid city name");
    }
  });
}

function showWeather(data) {
  cityNowEl.textContent = weatherData.name + " : " + date;
  var iconNowId = data.current.weather[0].icon;
  var iconNowUrl = "https://openweathermap.org/img/wn/" + iconNowId + "@2x.png";
  iconNowEl.setAttribute("src", iconNowUrl);
  iconNowEl.setAttribute("style", "width: 50px; height:50px;");

  tempNowEl.textContent = "Temp : " + data.current.temp + " C";
  windNowEl.textContent = "Wind : " + data.current.wind_speed + " m/s";
  humidityNowEl.textContent = "Humidity : " + data.current.humidity + " %";
  uvNowEl.textContent = "UV Index : " + data.current.uvi;

  for (var i = 0; i < 5; i++) {
    var futureForecast = moment()
      .add(i + 1, "days")
      .format("DD/MM/YYYY");
    var icnName = data.daily[i].weather[0].icon;
    var icnAddress = "https://openweathermap.org/img/wn/" + icnName + "@2x.png";

    var futureDayDiv = document.createElement("div");
    futureDayDiv.setAttribute("class", "showfutureDay");
    var futureDate = document.createElement("h4");

    futureDate.textContent = futureForecast;
    var iconSymbol = document.createElement("img");
    iconSymbol.setAttribute("src", icnAddress);
    iconSymbol.setAttribute("class", "iconfivedays");
    var futureWeather = document.createElement("div");

    futureWeather.innerHTML =
      "<p> Temp : " +
      data.daily[i].temp.day +
      " C </p> <p> Wind : " +
      data.daily[i].wind_speed +
      " m/s </p> <p> Humidity : " +
      data.daily[i].humidity +
      " % </p>";

    futureDayDiv.appendChild(futureDate);
    futureDayDiv.appendChild(iconSymbol);
    futureDayDiv.appendChild(futureWeather);
    futureDayEl.appendChild(futureDayDiv);
  }
}
