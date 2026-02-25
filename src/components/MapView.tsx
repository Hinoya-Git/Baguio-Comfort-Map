import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { BAGUIO_CENTER } from '../data/locations';
import { Location, CrowdLevel } from '../types';
import { cn } from '../lib/utils';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
  crowdLevels: Record<string, CrowdLevel>;
  mapStyle: 'satellite' | 'standard';
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, {
      duration: 1.5
    });
  }, [center, map]);
  return null;
}

// Component to track zoom level
function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
}

const getMarkerColor = (id: string, level: CrowdLevel) => {
  if (id.includes('uc')) return '#16a34a'; // Green for UC
  if (id.includes('slu')) return '#1e3a8a'; // Navy for SLU
  if (id.includes('ub')) return '#dc2626'; // Red for UB
  if (id.includes('sm')) return '#0ea5e9'; // Sky Blue for SM
  
  // Default based on crowd level
  return level === 'Low' ? '#10b981' : level === 'Medium' ? '#eab308' : '#f43f5e';
};

const createCustomIcon = (level: CrowdLevel, id?: string) => {
  const color = getMarkerColor(id || '', level);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 41" width="24" height="41" class="drop-shadow-md">
        <path fill="${color}" stroke="white" stroke-width="1.5" d="M12 0C5.373 0 0 5.373 0 12c0 8 12 29 12 29s12-21 12-29c0-6.627-5.373-12-12-12zm0 17a5 5 0 110-10 5 5 0 010 10z"/>
      </svg>
    `,
    iconSize: [24, 41],
    iconAnchor: [12, 41], // Tip of the pin at bottom center
    popupAnchor: [0, -41],
  });
};

export function MapView({ locations, selectedLocation, onSelectLocation, crowdLevels, mapStyle }: MapViewProps) {
  const center: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng] 
    : BAGUIO_CENTER;

  const [currentZoom, setCurrentZoom] = useState(13);

  return (
    <MapContainer 
      center={BAGUIO_CENTER} 
      zoom={13} 
      scrollWheelZoom={true} 
      className="w-full h-full z-0"
      zoomControl={false}
    >
      {mapStyle === 'satellite' ? (
        <>
          {/* Esri World Imagery (Satellite) */}
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
          
          {/* Esri Labels Overlay */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        </>
      ) : (
        /* Google Maps Standard View (using Google Tiles) */
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
        />
      )}
      
      <MapController center={center} />
      <ZoomTracker onZoomChange={setCurrentZoom} />

      {/* Location Markers Removed as requested */}
    </MapContainer>
  );
}
