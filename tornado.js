// script.js
const windyAPIKey = 'zLFEKEo1xSyBoopJEZClLSa1Sp4mfNe9';
const openWeatherAPIKey = '31ff8768b6a0ad8fce5c212ac6b3330d';

// Coordinates (default to New York)
let lat = 40.7128; // Changed to let since these may need to be updated
let lon = -74.0060;

// Initialize the map
const map = L.map('map').setView([lat, lon], 8);

// Add Windy.com tiles to the map
L.tileLayer(`https://tiles.windy.com/maps/radar/{z}/{x}/{y}.png?key=${windyAPIKey}`, {
    attribution: 'Map data &copy; Windy.com',
}).addTo(map);

// Fetch weather data from OpenWeatherMap
async function fetchWeatherData() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${openWeatherAPIKey}&units=metric`; // Added units=metric
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Analyze weather data for storm and tornado risks
function analyzeWeatherData(data) {
    const weatherInfo = document.getElementById('weather-info');
    const tornadoRisk = document.getElementById('tornado-risk');

    if (!data || !data.current) {
        weatherInfo.textContent = 'Weather data unavailable';
        tornadoRisk.textContent = 'Risk assessment unavailable';
        return 0;
    }

    const windSpeed = data.current.wind_speed; // m/s
    const precipitation = data.current?.weather?.[0]?.main || 'Unknown'; // Added fallback

    // Display general weather info
    weatherInfo.textContent = `Current Conditions: ${precipitation} | Wind Speed: ${windSpeed.toFixed(1)} m/s`;

    // Calculate tornado risk
    let risk = 0;
    if (windSpeed > 15 && windSpeed <= 25) risk += 30; // Moderate risk
    if (windSpeed > 25) risk += 50; // High risk
    if (precipitation === 'Thunderstorm') risk += 20;

    tornadoRisk.textContent = `Tornado Risk: ${risk}%`;
    return risk;
}

// Display storm data on the map
function displayStormMarkers(data) {
    // Clear existing markers first
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    if (data.alerts && Array.isArray(data.alerts)) {
        data.alerts.forEach(alert => {
            if (alert && alert.event) {
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`Alert: ${alert.event}<br>${alert.description}`)
                    .openPopup();
            }
        });
    } else {
        console.log('No active storm alerts.');
    }
}

// Main function to initialize the app
async function init() {
    try {
        const data = await fetchWeatherData();
        analyzeWeatherData(data);
        displayStormMarkers(data);
    } catch (error) {
        console.error('Error initializing app:', error);
        document.getElementById('weather-info').textContent = 'Error loading weather data';
        document.getElementById('tornado-risk').textContent = 'Risk assessment unavailable';
    }
}

// Refresh every 15 minutes
setInterval(init, 15 * 60 * 1000);
init();
