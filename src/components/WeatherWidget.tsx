import { Cloud, CloudFog, CloudRain, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData;
  className?: string;
}

export function WeatherWidget({ weather, className }: WeatherWidgetProps) {
  const Icon = {
    cloud: Cloud,
    sun: Sun,
    rain: CloudRain,
    fog: CloudFog,
  }[weather.icon] || Cloud;

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white",
      className
    )}>
      <div className="p-3 bg-white/20 rounded-full">
        <Icon className="w-8 h-8 text-yellow-300" />
      </div>
      <div>
        <h2 className="text-3xl font-bold tracking-tighter">{weather.temperature}°C</h2>
        <p className="text-sm font-medium opacity-90 uppercase tracking-wide">{weather.condition}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-xs opacity-70">Humidity</p>
        <p className="font-mono text-sm">{weather.humidity}%</p>
      </div>
    </div>
  );
}
