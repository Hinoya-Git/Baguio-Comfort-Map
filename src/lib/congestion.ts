import { isWeekend } from 'date-fns';
import { CrowdLevel, Location, WeatherCondition } from '../types';

export function calculateCongestionLevel(
  location: Location,
  date: Date,
  hour: number,
  weather: WeatherCondition
): CrowdLevel {
  // 1. Weather Logic
  if (weather === 'Rainy') {
    if (location.category === 'Outdoor') return 'Low'; // Quiet
    if (location.category === 'Indoor') return 'Medium'; // Busy (or High, but prompt says Busy)
  }

  // 2. Specific Time Logic (Session Road)
  if (location.id === 'session-road' && hour >= 17 && hour <= 20) {
    return 'High'; // Packed
  }

  // 3. Base Calculation using Historical Data
  let score = 1; // Base score

  // Peak Hours
  if (location.peakHours.includes(hour)) {
    score += 1.5;
  }

  // Weekend Multiplier
  if (isWeekend(date)) {
    score *= location.weekendMultiplier;
  }

  // Weather Multiplier (Sunny is standard, Foggy might reduce slightly or increase for "mood")
  if (weather === 'Sunny') {
    score *= 1.1; // Slightly more people when sunny
  } else if (weather === 'Foggy') {
    score *= 0.9; // Slightly less, unless it's a specific spot
  }

  // Final Thresholds
  if (score < 1.5) return 'Low';
  if (score < 2.5) return 'Medium';
  return 'High';
}

export const CROWD_COLORS = {
  Low: 'bg-emerald-500',
  Medium: 'bg-yellow-500',
  High: 'bg-rose-500',
};

export const CROWD_TEXT_COLORS = {
  Low: 'text-emerald-500',
  Medium: 'text-yellow-500',
  High: 'text-rose-500',
};

export const CROWD_LABELS = {
  Low: 'Quiet',
  Medium: 'Busy',
  High: 'Packed',
};
