export const weather = () => {
  $.ajax({
    type: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=busan&appid=d6ca71408c5c6aa7a055c6f5d8bfd31a&units=metric",
    data: {},
    success: function (response) {
      const c_temp = response.main.temp
      const icon = response.weather[0].icon
      const city = response.name

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
    }
  })
}