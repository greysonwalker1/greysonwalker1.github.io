window.onload = function() {
    // Initialize the function to get location and weather data
    getUserLocation();
};

// Function to fetch the user's location and weather data
function getUserLocation() {
    if (navigator.geolocation) {
        document.getElementById("location-info").innerText = "Fetching your location...";
        navigator.geolocation.getCurrentPosition(getWeatherData, showError);
    } else {
        document.getElementById("location-info").innerText = "Geolocation is not supported by this browser.";
    }
}

// Function to fetch weather data and city from OpenWeatherMap API
function getWeatherData(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '31ff8768b6a0ad8fce5c212ac6b3330d';

    // URLs for weather and reverse geocoding APIs
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    // Fetch weather data
    fetch(weatherUrl)
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch weather data'))
        .then(data => {
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("condition").innerText = capitalizeFirstLetter(data.weather[0].description);
            document.getElementById("humidity").innerText = Math.round(data.main.humidity);
            document.getElementById("wind-speed").innerText = Math.round(data.wind.speed);
            document.getElementById("forecast-content").style.display = "block";

            // Fetch city name
            return fetch(reverseGeocodeUrl);
        })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch location data'))
        .then(locationData => {
            const city = locationData.address.city || locationData.address.town || locationData.address.village || "Unknown Location";
            document.getElementById("location-info").innerText = `Current forecast for ${city}`;
        })
        .catch(error => {
            document.getElementById("location-info").innerText = "Unable to fetch forecast data. Please try again later.";
            document.getElementById("forecast-content").style.display = "none";
            console.error("Error fetching data:", error);
        });
}

// Function to show error if location access is denied
function showError(error) {
    let message = "An unknown error occurred.";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = "Please enable location services to get weather information for your area.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Unable to determine your location. Please try again later.";
            break;
        case error.TIMEOUT:
            message = "It's taking too long to find your location. Please check your connection and try again.";
            break;
    }
    document.getElementById("location-info").innerText = message;
    document.getElementById("forecast-content").style.display = "none";
}

// Utility function to capitalize the first letter of each word
function capitalizeFirstLetter(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Placeholder for interactive functionality
