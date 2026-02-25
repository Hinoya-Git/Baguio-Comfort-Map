import { WeatherCondition } from '../types';

export function predictWeatherCondition(date: Date, hour: number): WeatherCondition {
  const month = date.getMonth();
  const isWetSeason = month >= 4 && month <= 9; // May-Oct

  if (isWetSeason) {
    if (hour >= 13 && hour <= 18) return 'Rainy';
    if (hour <= 6 || hour >= 20) return 'Foggy';
    return 'Sunny';
  } else {
    // Dry Season
    if (hour <= 6) return 'Foggy';
    return 'Sunny';
  }
}

export function calculateWeatherMetrics(date: Date, hour: number, condition: WeatherCondition) {
  const month = date.getMonth();
  
  // Adjusted Base Temperatures (Baguio is warmer than the previous simulation)
  let baseTemp = 22; // Default

  if (month === 0 || month === 11) { // Dec, Jan (Coldest)
    baseTemp = 19;
  } else if (month === 1) { // Feb (Transition/Panagbenga)
    baseTemp = 21; 
  } else if (month >= 2 && month <= 4) { // Mar, Apr, May (Warmest)
    baseTemp = 24;
  } else { // Jun-Nov (Wet Season)
    baseTemp = 22;
  }

  // Diurnal variation (Peak at 2 PM)
  // Amplitude of 4 means +/- 4 degrees from base
  const timeOffset = hour - 14;
  const tempVariation = Math.cos((timeOffset * Math.PI) / 12) * 4;
  
  let temperature = Math.round(baseTemp + tempVariation);

  // Adjust for condition
  if (condition === 'Rainy') temperature -= 2;
  if (condition === 'Sunny') temperature += 1;
  if (condition === 'Foggy') temperature -= 1;

  // Humidity
  let humidity = 75;
  if (condition === 'Rainy') humidity = 95;
  else if (condition === 'Foggy') humidity = 90;
  else if (condition === 'Sunny') humidity = 60;

  // Adjust humidity by time (higher at night)
  if (hour < 6 || hour > 18) humidity += 10;

  return {
    temperature,
    humidity: Math.min(100, humidity)
  };
}
