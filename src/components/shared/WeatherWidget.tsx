import { WeatherData } from "@/lib/weather";

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 text-center">
      <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Current Weather</h3>
      {weather?.main ? (
        <div className="flex items-center justify-center gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="w-16 h-16 drop-shadow-sm"
          />
          <div className="text-left">
            <div className="text-3xl font-extrabold text-blue-950">
              {Math.round(weather.main.temp)}°C
            </div>
            <div className="text-sm font-medium text-blue-700 capitalize">
              {weather.weather[0].description}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Weather data unavailable</p>
      )}
    </div>
  );
}
