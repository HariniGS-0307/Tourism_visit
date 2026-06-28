export interface WeatherData {
  weather: { main: string; description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number };
  name: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return {
      weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
      main: { temp: 28.5, feels_like: 30.2, humidity: 65 },
      name: "Maharashtra",
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 1800 } }
    );

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
