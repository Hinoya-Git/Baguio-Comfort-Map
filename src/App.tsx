import { useState, useMemo, useEffect } from 'react';
import { MapPin, Menu, X } from 'lucide-react';
import { MapView } from './components/MapView';
import { WeatherWidget } from './components/WeatherWidget';
import { CrowdMeter } from './components/CrowdMeter';
import { ForecastControl } from './components/ForecastControl';
import { LOCATIONS } from './data/locations';
import { Location, WeatherData, WeatherCondition, CrowdLevel } from './types';
import { calculateCongestionLevel } from './lib/congestion';
import { predictWeatherCondition, calculateWeatherMetrics } from './lib/weather';
import { cn } from './lib/utils';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<number>(new Date().getHours());
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>('Sunny');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'standard'>('satellite');

  // Update weather condition when date or time changes
  useEffect(() => {
    const predictedCondition = predictWeatherCondition(selectedDate, selectedTime);
    setSelectedWeather(predictedCondition);
  }, [selectedDate, selectedTime]);

  // Calculate metrics based on current state
  const weatherMetrics = useMemo(() => 
    calculateWeatherMetrics(selectedDate, selectedTime, selectedWeather),
    [selectedDate, selectedTime, selectedWeather]
  );

  const weatherData: WeatherData = {
    condition: selectedWeather,
    temperature: weatherMetrics.temperature,
    humidity: weatherMetrics.humidity,
    icon: selectedWeather === 'Sunny' ? 'sun' : selectedWeather === 'Rainy' ? 'rain' : 'fog',
  };

  // Calculate crowd levels for all locations
  const crowdLevels = useMemo(() => {
    const levels: Record<string, CrowdLevel> = {};
    LOCATIONS.forEach(loc => {
      levels[loc.id] = calculateCongestionLevel(loc, selectedDate, selectedTime, selectedWeather);
    });
    return levels;
  }, [selectedDate, selectedTime, selectedWeather]);

  return (
    <div className="h-screen w-full bg-slate-900 text-white overflow-hidden flex flex-col">
      
      {/* Forecast Control Panel (Top) */}
      <ForecastControl 
        date={selectedDate}
        onDateChange={setSelectedDate}
        time={selectedTime}
        onTimeChange={setSelectedTime}
        weather={selectedWeather}
        onWeatherChange={setSelectedWeather}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Mobile Header (Below Forecast Control) */}
        <header className="md:hidden p-4 flex items-center justify-between bg-white/5 border-b border-white/10 z-20">
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Baguio Comfort Map
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Sidebar / Control Panel */}
        <aside className={cn(
          "absolute inset-y-0 left-0 z-20 w-full md:w-96 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* Brand (Desktop) */}
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Baguio Comfort Map
              </h1>
              <p className="text-slate-400 text-xs mt-1">Real-time crowd predictions.</p>
            </div>

            {/* Weather Widget */}
            <WeatherWidget weather={weatherData} />

            {/* Crowd Levels List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Crowd Levels
                </label>
                <span className="text-xs text-slate-500">
                  {selectedWeather} • {selectedTime}:00
                </span>
              </div>
              
              <div className="space-y-2">
                {LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full text-left transition-all duration-200 hover:scale-[1.02]",
                      selectedLocation?.id === loc.id ? "ring-2 ring-emerald-500 rounded-xl bg-white/5" : ""
                    )}
                  >
                    <CrowdMeter 
                      location={loc} 
                      level={crowdLevels[loc.id]}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 text-center text-[10px] text-slate-600 uppercase tracking-widest">
            Simulated Data • Baguio City
          </div>
        </aside>

        {/* Main Map Area */}
        <main className="flex-1 relative z-0 bg-slate-800">
          <MapView 
            locations={LOCATIONS} 
            selectedLocation={selectedLocation} 
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              setIsSidebarOpen(true);
            }}
            crowdLevels={crowdLevels}
            mapStyle={mapStyle}
          />
          
          {/* Floating Action Button for Mobile */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden absolute bottom-6 right-6 z-[1000] p-4 bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-600 transition-transform hover:scale-110"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </main>

      </div>
    </div>
  );
}
