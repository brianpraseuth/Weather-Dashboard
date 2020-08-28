var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;



$("#search-city").on("click", function (event) {
    event.preventDefault();
    var city = $("#citySearched").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=60f321b5ed03e96b84214d5e3b16fde0";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        var lat = response.coord.lat;
        var long = response.coord.lon;
        var UVURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=60f321b5ed03e96b84214d5e3b16fde0&lat=" + lat + "&lon=" + long + "&cnt=1";
        forecast(city);
        $.ajax({
            url: UVURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var colorButton = $("<button>").attr("id", "uvColors").text(response[0].value);
            $(".uvIndex").text(`UV Index: `).append(colorButton);
            console.log(response[0].value);
            if (response[0].value < 3) {
                $("#uvColors").addClass("green");
            } else if (response[0].value >= 3 && response[0].value < 7) {
                $("#uvColors").addClass("yellow");
            } else {
                $("#uvColors").addClass("red");
            }
        });

        $(".cityDate").html("<h1>" + response.name + " " + today);
        $(".temperature").text("Temperature: " + tempF.toFixed(2) + " Farenheit");
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        $(".windSpeed").text("Wind Speed: " + response.wind.speed + "MPH");

        // Figure out how to make saved searches fun searchCity funtion...
        
        localStorage.setItem("savedSearches", city);

        var cityListItem = $("<button>");

        cityListItem = localStorage.getItem("savedSearches");
        

        $("#savedSearches").append(cityListItem);
    });
});

$("#citySearched").keypress(function (e) {
    if (e.which == 13) {
        $("#search-city").click();
    }
});


// Five day forecast ajax call
function forecast(city) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=60f321b5ed03e96b84214d5e3b16fde0&units=imperial`;
    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        const dailyData = response.list.filter(reading => {
            return reading.dt_txt.includes("15:00:00")
        })
        console.log(dailyData);
        dailyData.forEach((day) => {
            var dayColumn = $("<div>");
            var dayCard = $("<div>").addClass("card");
            var content = $("<div>").addClass("card-content");
            var date = $("<h5>").text(new Date(day.dt_txt).toLocaleDateString());
            var temp = $("<p>").text("Temp: " + day.main.temp + "F");
            var icons = $("<img>").attr("src", "https://openweathermap.org/img/w/" + day.weather[0].icon + ".png");
            var humidity = $("<p>").text("Humidity: " + day.main.humidity + "%");

            content.append(date, temp, icons, humidity);
            dayCard.append(content);
            dayColumn.append(dayCard);
            $("#fiveDay").append(dayColumn);

        })
    })
}