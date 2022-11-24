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


      const temp_html1 = `${c_temp} °`

      const div1 = document.createElement('div');
      div1.classList.add("c_temp");
      div1.innerHTML = temp_html1;
      weather.appendChild(div1);


      const temp_html2 = ` <img src="http://openweathermap.org/img/wn/${icon}.png">`

      const div2 = document.createElement('div');
      div2.classList.add("c_temp");
      div2.innerHTML = temp_html2;
      weather.appendChild(div2);

      const temp_html3 = `${city}`

      const div3 = document.createElement('div');
      div3.classList.add("c_temp");
      div3.innerHTML = temp_html3;
      weather.appendChild(div3);


    }
  })
}