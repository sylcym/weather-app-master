const btnSearch = document.querySelector('.btn-search');
const btnHere = document.querySelector('.btn-here');
const btnClose = document.querySelector('.btn-close');
const btnSubmit = document.querySelector('.btn-nav');
const btnCelsius = document.querySelector('.btn-weather-c');
const btnFahrenheit = document.querySelector('.btn-weather-f');
const navigation = document.querySelector('.nav');
const cityName = document.querySelector('.form-input#location');
const searchLinks = document.querySelectorAll('.search-item');
const weatherMainInfo = document.querySelector('.weather-main-info');
const weatherMainOverview = document.querySelector('.overview');
const weatherWeekInfo = document.querySelector('.weather');

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const imgUrl = 'http://openweathermap.org/img/wn/';
const apiKey = config.MY_KEY;

const miles = 0.00062137;

let defaultUnits = 'metric';

async function getWeather() {
  try {
    const todayWeather = await fetch(
      `${apiUrl}?q=${cityName.value || 'oslo'}&units=${defaultUnits}&appid=${apiKey}`,
    );

    const weekWeather = await fetch('./assets/api/api-data-mockup.json');

    if (!todayWeather.ok)
      throw new Error(`Whoops.. something went wrong! Check the city name! 💥`);

    const weatherData = await todayWeather.json();
    const weekWeatherData = await weekWeather.json();

    weatherWeekInfo.innerHTML = '';

    displayTodayWeather(weatherData);
    displayOverviewWeather(weatherData);
    weekWeatherData.forEach((item, index) => displayWeekWeather(item, index));
  } catch (err) {
    alert(err);
  }
}

function displayTodayWeather(weatherData) {
  weatherMainInfo.innerHTML = '';

  const html = `
    <img  class="images-sun" alt="Images sun" src=${imgUrl + weatherData.weather[0].icon}@4x.png>

    <h1 class="heading-1">
      <span class="heading-degrees">
        <strong class="heading-strong">${Math.trunc(weatherData.main.temp)}</strong>
        <span class="heading-degree-type">${defaultUnits === 'metric' ? '°C' : '°F'}</span >
      </span >
      <span class="heading-info">${weatherData.weather[0].main}</span>
    </h1 >

    <div class="header-container--2">
      <p class="header-day">Today</p>
      <span>•</span>
      <p class="header-data">${new Date().toUTCString().split(' ').slice(0, 3).join(' ')}</p>
    </div>

    <div class="header-location">
      <img src="./assets/icons/icon-location.svg" class="icon-location" alt="Icon location">
      <p class="header-place">${weatherData.name}</p>
    </div>
  `;

  weatherMainInfo.insertAdjacentHTML('beforeend', html);
}

function displayOverviewWeather(weatherData) {
  weatherMainOverview.innerHTML = '';

  const html = `
    <h2 class="heading-2">Today's Hightlights</h2>
    
    <div class="overview-wrapper">
      <div class="overview-container">
        <p class="overview-description">Wind status</p>
        <p class="overview-info">
          <strong class="overview-number">${weatherData.wind.speed}</strong>
          <span class="overview-detail">mph</span>
        </p>
        <div class="overview-position">
          <img src="./assets/icons/icon-wind.svg" class="icon-wind" alt="Icon wind" style="transform:rotate(${weatherData.wind.deg}deg)">
          <span class="overview-wind">WSW</span>
        </div>
      </div>

      <div class="overview-container">
        <p class="overview-description">Humidity</p>
        <p class="overview-info">
          <strong class="overview-number">${weatherData.main.humidity}</strong>
          <span class="overview-detail" style="width:${weatherData.main.humidity}%">%</span>
        </p>
        <div class="overview-file">
          <div class="overview-percent">
            <span class="span-progress-zero">0</span>
            <span class="span-progress-fifty">50</span>
            <span class="span-progress-hundred">100</span>
          </div>
          <div class="humidity-bar-track">
            <span class="humidity-bar-thumb"></span>
          </div>
          <span class="span-progress">%</span>
        </div>
      </div>
      </div>
      <div class="overview-wrapper">
      <div class="overview-container">
        <p class="overview-description">Visibility</p>
        <p class="overview-info">
          <strong class="overview-number">${(weatherData.visibility * miles).toFixed(1)}</strong>
          <span class="overview-detail">miles</span>
        </p>
      </div>

      <div class="overview-container">
        <p class="overview-description">Air Pressure</p>
        <p class="overview-info">
          <strong class="overview-number">${weatherData.main.pressure}</strong>
          <span class="overview-detail">mb</span>
        </p>
      </div>
    </div>
  `;

  weatherMainOverview.insertAdjacentHTML('beforeend', html);
}

function displayWeekWeather(weatherData, index) {
  let day = '';

  if (index === 0) {
    day = 'Tomorrow'
  } else {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + index);

    day = nextDay.toUTCString().split(' ').slice(0, 3).join(' ');
  }

  const html = `
    <div class="weather-data">
      <p class="weather-day">${day}</p>

      <img class="img-aura" alt="Images aura" src=${imgUrl + weatherData.weather[0].icon}@2x.png>
      <div class="weather-degrees">
        <p class="weather-degrees-max"><span class="weather-strong">${Math.trunc(weatherData.main.temp_min)}</span>℃</p>
        <p class="weather-degrees-min"><span class="weather-strong">${Math.trunc(weatherData.main.temp_max)}</span>℃</p>
      </div>
    </div>
  `;

  weatherWeekInfo.insertAdjacentHTML('beforeend', html);
}

function setUnitValue(unit, firstBtn, secondBtn) {
  defaultUnits = unit;
  firstBtn.classList.add('active');
  secondBtn.classList.remove('active');
  cityName.value = document.querySelector('.header-place').textContent;
  getWeather();
}

function resetSearch() {
  cityName.value = '';
  navigation.classList.remove('open');
}

btnSearch.addEventListener('click', () => { navigation.classList.add('open') });
btnClose.addEventListener('click', () => { navigation.classList.remove('open') });
btnCelsius.addEventListener('click', () => { setUnitValue('metric', btnCelsius, btnFahrenheit) });
btnFahrenheit.addEventListener('click', () => { setUnitValue('imperial', btnFahrenheit, btnCelsius) });
btnHere.addEventListener('click', () => {
  cityName.value = 'oslo';
  getWeather();
});
btnSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  getWeather();
  resetSearch();
});
searchLinks.forEach(link => {
  link.addEventListener('click', () => {
    cityName.value = link.textContent;
    getWeather();
    resetSearch();
  });
})

getWeather();
