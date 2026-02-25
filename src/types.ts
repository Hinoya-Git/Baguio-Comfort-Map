export type CrowdLevel = 'Low' | 'Medium' | 'High';
export type WeatherCondition = 'Sunny' | 'Rainy' | 'Foggy';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  category: 'Indoor' | 'Outdoor';
  peakHours: number[]; // Array of hours (0-23)
  weekendMultiplier: number; // 1.0 to 2.0
  imageUrl: string;
}

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  icon: 'cloud' | 'sun' | 'rain' | 'fog';
}
