import apiKey from "./apikey";
import Task from "data.task";
import { getWeatherItems } from "./model";
import { compose } from "ramda";
const zip = "55455";
const fetchIt = (url) =>
  new Task((rej, res) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&APPID=${apiKey}`
    )
      .then(res)
      .then((x) => x.json)
      .catch(rej);
  });

const makeWeatherUrl = (zip) =>
  `http://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&APPID=${apiKey}`;

const openWeather = {
  fetch: compose(fetchIt, makeWeatherUrl),
};

const app = () => {
  const goButton = getElementById("go");
  const input = getElementById("zip");
  const results = getElementById("results");

  goButton.addEventListener("click", () => {
    const zipCode = input.value.trim();
    openWeather.fetch(zipCode).fork(console.error, console.log);
  });
};

app();

/*
const populateUI = (zip) =>
  getWeatherItems({ zip, apiKey }).map((weathers) => weathers.map(toLi));

const toLi = (weather) => `<li>${weather.dt} ${weather.temp}</li>`;

///=============================
const app = () => {
  const goButton = document.getElementById("go");
  const input = document.getElementById("zip");
  const results = document.getElementById("results");

  goButton.addEventListener("click", () => {
    const zip = input.value.trim();
    populateUI(zip).fork(console.error, (html) => {
      results.innerHTML = html;
    });
  });
};

app();
*/
