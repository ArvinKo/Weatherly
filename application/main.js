//sets html elements into constants
const button = document.querySelector("#submit");
const backButton = document.querySelector("#back");
const ownLocation = document.querySelector("#ownLoc");
const inputValue = document.querySelector("#inputValue");
const name = document.querySelector("#name");
const desc = document.querySelector("#desc");
const temp = document.querySelector("#temp");
const humid = document.querySelector("#humid");
const thermom = document.querySelector("#thermom");
const map = document.querySelector("#mapLocation");
const display = document.querySelector(".display");
const error = document.querySelector("#error");
const title = document.querySelector("#title");

//API Key
const key = "308b224477c11b89158cfbb4e5416894";

//hides html elements
map.style.display = "none";
backButton.style.display = "none";
display.style.display = "none";

//hides and reveals html elements
function hideAndRevealElements() {
  button.style.display = "none";
  inputValue.style.display = "none";
  ownLocation.style.display = "none";
  error.style.display = "none";
  title.style.display = "none";
  map.style.display = "block";
  backButton.style.display = "block";
  display.style.display = "block";
}

//alters html elements to display data
function changeElements(data) {
  const nameValue = data.name;
  const tempValue = data.main.temp;
  const descValue = data.weather[0].description;
  const latitude = data.coord.lat;
  const longitude = data.coord.lon;
  const humidity = data.main.humidity;

  name.innerHTML = nameValue;
  temp.innerHTML = tempValue + "°C";
  desc.innerHTML = descValue.toUpperCase();
  humid.innerHTML = "Humidity: " + humidity + "%";
  hideAndRevealElements();
  createMap(latitude, longitude);
}

//inserts an image based on the temperature of the chosen city
function insertImage(data) {
  const temperature = data.main.temp;

  if (temperature < 10) {
    thermom.src = "images/cold.png";
  } else if (temperature < 30) {
    thermom.src = "images/warm.png";
  } else {
    thermom.src = "images/hot.png";
  }
}

//sends information about a chosen city into a database
async function sendInformation(data) {
  const newData = {
    name: data.name,
    temp: data.main.temp,
    desc: data.weather[0].description,
    humid: data.main.humidity,
  };

  const information = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(newData),
  };
  fetch("/api", information);
}

//creates a map that displays the chosen location using leaflet.js
function createMap(lat, lon) {
  //making the map and tiles
  const mymap = L.map("mapLocation").setView([0, 0], 1);
  const attribution =
    '&copy: <a? href="https://www.openstreetmap.org/copyright">OpenStreetMap</a? contributors';

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tiles = L.tileLayer(tileUrl, { attribution });
  tiles.addTo(mymap);

  mymap.setView([lat, lon], 10);
}

//submits the chosen city and receives data about it
button.addEventListener("click", async () => {
  const response = await fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      inputValue.value +
      "&units=metric&appid=" +
      key
  );
  const data = await response.json();

  //error checking
  if (data.cod == 404) {
    document.querySelector("#error").innerHTML = data.message;
  } else {
    changeElements(data);
    insertImage(data);
    sendInformation(data);
  }
});

//finds the user's location and displays data
ownLocation.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const response = await fetch(
        "http://api.openweathermap.org/data/2.5/weather?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=metric&appid=" +
          key
      );
      const data = await response.json();
      changeElements(data);
      insertImage(data);
      sendInformation(data);
    });
  } else {
    document.querySelector("#error").innerHTML =
      "Browser Does Not Support Geolocation";
  }
});

//allows users to enter another city
backButton.addEventListener("click", function () {
  window.location.reload();
});
