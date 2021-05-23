// DOM Selector variable declarations
let searchButton = document.getElementById('search-button');
let cityName = document.getElementById("city-name");
let iconData = document.getElementById("hero-icon");
let tempData = document.getElementById("temp-data");
let windData = document.getElementById("wind-data");
let humidityData = document.getElementById("humidity-data");
let uvData = document.getElementById("UV-data");
let dateData = document.getElementById("today");
let searchHistory = document.getElementById("search-history");
let searchInput = document.getElementById('search-input');
let inputValue = searchInput.value;
let saved = JSON.parse(localStorage.getItem("searchLog")) || [];

// Kelvin to Fahrenheit converter function
function tempConvert(K) {
  return Math.floor((K - 273.15) * 1.8) + 32;
}

// Search input event listener
searchButton.addEventListener("click", function() {
  let searchCall = searchInput.value;
  callWeather(searchCall);
  saved.push(searchCall);
  localStorage.setItem("searchLog", JSON.stringify(saved));
  addHistory();
})

// Search history function
function addHistory() {
    searchHistory.innerHTML = "";
    
    for (let i = 0; i < saved.length; i++) {
      let historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "btn btn-success");
      historyItem.setAttribute("value", saved[i]);
      historyItem.textContent = saved[i];
      searchHistory.append(historyItem);
      searchHistory.addEventListener("click",function() {
        callWeather(historyItem.textContent);
        return;
      })
      
    }
}

// Open Weather API call
function callWeather(inputValue) {

  fetch("https://api.openweathermap.org/data/2.5/weather?q="+inputValue+"&appid=90e68ce77b8435beeccb450f414ea93b")
  .then(response => response.json()) 
  .then(data => {
    // Main weather query response definitions
    let cityResponse = data["name"];
    let tempResponse = data["main"]["temp"];
    let windResponse = data["wind"]["speed"];
    let humidityResponse = data["main"]["humidity"];
    let iconResponse = data["weather"][0]["icon"];
    let iconAlt = data["weather"][0]["description"];
    let dateResponse = new Date(data["dt"] *1000);
       // Current date unix UTC conversion
       let day = dateResponse.getDate();
       let month = dateResponse.getMonth() + 1;
       let year = dateResponse.getFullYear();
    
    // Data parse and insertion into HTML elements
    cityName.innerHTML = cityResponse + " (" + month + "/" + day + "/" + year + ")";
    cityName.innerHTML += "<img src=" + "http://openweathermap.org/img/w/" + iconResponse + ".png>";
    document.querySelector("img").setAttribute("alt", iconAlt);
    tempData.innerHTML = "Temp: " + tempConvert(tempResponse) + "&#176F";
    windData.innerHTML = "Wind: " + windResponse + " MPH";
    humidityData.innerHTML = "Humidity: " + humidityResponse + "%";
  
    //UV Index API call
    let lat = data["coord"]["lat"];
    let lon = data["coord"]["lon"];
    
    fetch ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=90e68ce77b8435beeccb450f414ea93b&cnt=1")
    .then(response => response.json())
    .then(data => {
      let uvResponse = data["current"]["uvi"];
        // Color picker for UV index element
      
      if (uvResponse < 3) {
        uvData.setAttribute("class", "badge badge-success");
      } else if (uvResponse > 3 && uvResponse < 5) {
        uvData.setAttribute("class", "badge badge-warning");
      } else {
        uvData.setAttribute("class", "badge badge-danger");
      }
      uvData.innerHTML = "UV Index: " + uvResponse;
      console.log(data);

      // 5-day forecast content insertion
        // Date Array
      let date1 = document.getElementById("fd-date-1");
      let date2 = document.getElementById("fd-date-2");
      let date3 = document.getElementById("fd-date-3");
      let date4 = document.getElementById("fd-date-4");
      let date5 = document.getElementById("fd-date-5");
      let fiveDate = [date1, date2, date3, date4, date5];
        // Icon Array
      let icon1 = document.getElementById("fd-icon-1");
      let icon2 = document.getElementById("fd-icon-2");
      let icon3 = document.getElementById("fd-icon-3");
      let icon4 = document.getElementById("fd-icon-4");
      let icon5 = document.getElementById("fd-icon-5");
      let fiveIcon = [icon1, icon2, icon3, icon4, icon5];
        // Temp Array
      let temp1 = document.getElementById("fd-temp-1");
      let temp2 = document.getElementById("fd-temp-2");
      let temp3 = document.getElementById("fd-temp-3");
      let temp4 = document.getElementById("fd-temp-4");
      let temp5 = document.getElementById("fd-temp-5");
      let fiveTemp = [temp1, temp2, temp3, temp4, temp5];
        // Wind Array
      let wind1 = document.getElementById("fd-wind-1");
      let wind2 = document.getElementById("fd-wind-2");
      let wind3 = document.getElementById("fd-wind-3");
      let wind4 = document.getElementById("fd-wind-4");
      let wind5 = document.getElementById("fd-wind-5");
      let fiveWind = [wind1, wind2, wind3, wind4, wind5];
        // Humidity Array
      let hum1 = document.getElementById("fd-humidity-1");
      let hum2 = document.getElementById("fd-humidity-2");
      let hum3 = document.getElementById("fd-humidity-3");
      let hum4 = document.getElementById("fd-humidity-4");
      let hum5 = document.getElementById("fd-humidity-5");
      let fiveHum = [hum1, hum2, hum3, hum4, hum5]

      for (let x = 0; x < fiveDate.length; x++) {
        // Date fill loop
        let dateResponse = new Date(data["daily"][x+1]["dt"] *1000);
        let fdDay = dateResponse.getDate();
        let fdMonth = dateResponse.getMonth() + 1;
        fiveDate[x].innerHTML = "(" + fdMonth + "/" + fdDay + "/" + year + ")";
        // Icon fill loop
        let iconResponse = data["daily"][x+1]["weather"][0]["icon"];
        let iconAlt = data["daily"][x+1]["weather"][0]["description"];
        fiveIcon[x].innerHTML = "<img src=" + "http://openweathermap.org/img/w/" + iconResponse + ".png>";
        fiveIcon[x].querySelector("img").setAttribute("alt", iconAlt);
        // Temp fill loop
        let tempResponse = data["daily"][x+1]["temp"]["day"];
        fiveTemp[x].innerHTML = "Temp: " + tempConvert(tempResponse) + "&#176F";
        // Wind fill loop
        let windResponse = data["daily"][x+1]["wind_speed"];
        fiveWind[x].innerHTML = "Wind: " + windResponse + " MPH";
        // Humidity fill loop
        let humResponse = data["daily"][x+1]["humidity"];
        fiveHum[x].innerHTML = "Humidity: " + humResponse + "%";
      }
      return;
    })
  })
};

addHistory();
