const apiKey = '79e2f1708b26cbaec4b20549b679c57e'; // Replace with your OpenWeatherMap API key

// Function to fetch current weather data by coordinates
async function fetchCurrentWeatherByCoords(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch current weather data:', error);
  }
}

// Function to fetch forecast data by coordinates
async function fetchForecastByCoords(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch forecast data:', error);
  }
}

// Function to update current weather information
function updateCurrentWeather(weatherData) {
  if (!weatherData) return;
  document.getElementById('current-temp').textContent = `${weatherData.main.temp}°C`;
  document.getElementById('current-humidity').textContent = `${weatherData.main.humidity}%`;
  document.getElementById('current-wind-speed').textContent = `${weatherData.wind.speed} mph`;
  document.getElementById('current-description').textContent = weatherData.weather[0].description;
  document.getElementById('current-lat').textContent = weatherData.coord.lat.toFixed(2);
  document.getElementById('current-lon').textContent = weatherData.coord.lon.toFixed(2);
  document.getElementById('current-city').textContent = weatherData.name; // Display the city name
}

// Function to populate forecast table
function populateForecastTable(forecastData) {
  if (!forecastData) return;
  const forecastTableBody = document.querySelector('#forecast-table tbody');
  forecastTableBody.innerHTML = '';

  forecastData.list.forEach((entry) => {
    if (entry.dt_txt.includes("12:00:00")) {
      const row = document.createElement('tr');

      const dateCell = document.createElement('td');
      dateCell.textContent = entry.dt_txt.split(' ')[0];
      row.appendChild(dateCell);

      const tempCell = document.createElement('td');
      tempCell.textContent = `${entry.main.temp}°C`;
      row.appendChild(tempCell);

      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = entry.weather[0].description;
      row.appendChild(descriptionCell);

      const precipitationCell = document.createElement('td');
      precipitationCell.textContent = `${(entry.pop * 100).toFixed(0)}%`;
      row.appendChild(precipitationCell);

      forecastTableBody.appendChild(row);
    }
  });
}

// On document load or based on some user action:
document.addEventListener('DOMContentLoaded', async () => {
  // Coordinates for a specific location (Example: London, UK)
  const lat = 6.2242;
  const lon = 80.1138;

  const weatherData = await fetchCurrentWeatherByCoords(lat, lon);
  const forecastData = await fetchForecastByCoords(lat, lon);

  updateCurrentWeather(weatherData);
  populateForecastTable(forecastData);
});

// Function to update current time and date
function updateCurrentDateTime() {
  const now = new Date();

  // Get current date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = now.toLocaleDateString('en-US', dateOptions);

  // Get current time
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}:${seconds}`;

  // Update elements in the HTML
  document.getElementById('current-date').textContent = currentDate;
  document.getElementById('current-time').textContent = currentTime;
}

// Call the function to update current date and time every second
setInterval(updateCurrentDateTime, 1000);

// Call the function initially to display the current date and time immediately
updateCurrentDateTime();
