import React, { useEffect, useState } from 'react';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lng, compact = false }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
        );
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️'; // Clear
    if (code >= 1 && code <= 3) return 'Oi⛅'; // Partly cloudy
    if (code >= 45 && code <= 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 67) return 'Oi🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '🌦️'; // Showers
    if (code >= 95) return '⛈️'; // Thunderstorm
    return '🌡️';
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
  };

  if (loading) {
    return compact ? (
      <span className="inline-block w-16 h-6 bg-slate-100 dark:bg-slate-700 rounded animate-pulse ml-2"></span>
    ) : (
      <div className="text-xs text-slate-400 animate-pulse">Loading weather...</div>
    );
  }

  if (!weather) {
     return compact ? null : <div className="text-xs text-slate-400">Weather unavailable</div>;
  }

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-1.5 bg-indigo-50/50 dark:bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/50 ml-3 shadow-sm transform hover:scale-105 transition-transform cursor-help" title={getWeatherDescription(weather.weathercode)}>
        <span className="text-lg leading-none">{getWeatherIcon(weather.weathercode)}</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{weather.temperature}°C</span>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 mt-2 border border-blue-100 dark:border-blue-900/30">
      <span className="text-2xl mr-2" role="img" aria-label="weather">
        {getWeatherIcon(weather.weathercode)}
      </span>
      <div>
        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {weather.temperature}°C
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {getWeatherDescription(weather.weathercode)}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;