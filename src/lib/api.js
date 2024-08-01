const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

export async function fetchWeather(city){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    return response.json();
}
export async function fetchForecast(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return response.json();
  }

export async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return response.json();
}