const apiKey = '31ff8768b6a0ad8fce5c212ac6b3330d';
let lat = 30.2672; // Default: Austin, TX
let lon = -97.7431;

async function fetchWeatherData() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
        );
        const data = await response.json();
        displayCurrentWeather(data);
        displayDailyForecast(data.daily);
        plotTemperatureChart(data.daily);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayCurrentWeather(data) {
    const current = data.current;
    document.getElementById('temperature').textContent = `${Math.round(current.temp)}°`;
    document.getElementById('condition').textContent = capitalizeWords(current.weather[0].description);
    document.getElementById('location').textContent = `${data.timezone.replace(/_/g, ' ')}`; // Format timezone name (e.g., "America/Chicago")

    // Get city's local time using the timezone from OpenWeatherMap
    const localTime = new Date().toLocaleString('en-US', {
        timeZone: data.timezone, // Use the API's timezone string
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    document.getElementById('date').textContent = localTime;
}

function displayDailyForecast(daily) {
    const forecastContainer = document.getElementById('daily-forecast');
    forecastContainer.innerHTML = '';
    daily.slice(0, 7).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
                <p>${Math.round(day.temp.max)}° / ${Math.round(day.temp.min)}°</p>
            </div>
        `;
    });
}

let temperatureChart;

function plotTemperatureChart(daily) {
    const ctx = document.getElementById('temp-chart').getContext('2d');
    const labels = daily.slice(0, 7).map(day =>
        new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })
    );
    const maxTemps = daily.slice(0, 7).map(day => Math.round(day.temp.max));
    const minTemps = daily.slice(0, 7).map(day => Math.round(day.temp.min));

    if (temperatureChart) {
        temperatureChart.destroy();
    }

    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Max Temperature (°F)',
                    data: maxTemps,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Min Temperature (°F)',
                    data: minTemps,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    fill: false,
                    tension: 0.1
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: { 
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: { 
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
            },
        },
    });
}

async function searchLocations(cityName) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
        );
        const locations = await response.json();
        displaySearchResults(locations);
    } catch (error) {
        console.error('Error searching for locations:', error);
    }
}

function displaySearchResults(locations) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    
    if (locations.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Please try another search.</p>';
        return;
    }

    const ul = document.createElement('ul');
    locations.forEach(location => {
        const li = document.createElement('li');
        li.textContent = `${location.name}, ${location.state || ''}, ${location.country}`;
        li.addEventListener('click', () => {
            lat = location.lat;
            lon = location.lon;
            fetchWeatherData();
            resultsContainer.innerHTML = '';
        });
        ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
}

function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();

    const searchButton = document.getElementById('search-button');
    const locationInput = document.getElementById('location-input');

    searchButton.addEventListener('click', () => {
        const cityName = locationInput.value.trim();
        if (cityName) {
            searchLocations(cityName);
        }
    });

    locationInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const cityName = locationInput.value.trim();
            if (cityName) {
                searchLocations(cityName);
            }
        }
    });
});
{const utcOffsetHours = data.timezone_offset / 3600; // Convert seconds to hours
    document.getElementById('date').textContent = `${localTime} (UTC${utcOffsetHours >= 0 ? '+' : ''}${utcOffsetHours})`;}
{function updateCityTime(timezone) {
    setInterval(() => {
        const localTime = new Date().toLocaleString('en-US', {
            timeZone: timezone,
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        document.getElementById('date').textContent = localTime;
    }, 1000);
}

// Call this in displayCurrentWeather():
updateCityTime(data.timezone);}
