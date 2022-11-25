const success = (position) => {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  weather(latitude, longitude);
}

const error = () => {
  console.log('Sorry, no position available.');
}

const options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
};

export const gps = () => {
  navigator.geolocation.watchPosition(success, error, options);
}

const weather = (lat, lon) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d6ca71408c5c6aa7a055c6f5d8bfd31a&units=metric`)
    .then(res => res.json())
    .then(data => {

      const c_temp = data.main.temp
      const icon = data.weather[0].icon
      const city = data.name

      const weather = document.getElementById("weather");
      weather.innerHTML = "";

      const temp_html = `<div>${city}</div>
          <div><img src="http://openweathermap.org/img/wn/${icon}.png"></div>
          <div>${c_temp} °</div>
          `

      const div = document.createElement('div');
      div.classList.add("weather-info");
      div.innerHTML = temp_html;
      weather.appendChild(div);

    })
}