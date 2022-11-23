export const weather = () => {
  $.ajax({
    type: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=busan&appid=d6ca71408c5c6aa7a055c6f5d8bfd31a&units=metric",
    data: {},
    success: function (response) {
      const c_temp = response.main.temp

      const weather = document.getElementById("weather");
      weather.innerHTML = "";

      let temp_html = `${c_temp} °`
      const div = document.createElement('div');
      div.innerHTML = temp_html;
      weather.appendChild(div);
    }
  })
}