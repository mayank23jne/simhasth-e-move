import { useEffect, useRef, useState } from 'react';
import { MapPin, Car, Bus, Trash, Bike } from 'lucide-react'; // Import icons
import { ERickshaw, GarbageVehicle } from '@/services/mockData'; // Import interfaces

// Helper function to calculate bounding box for route points
const calculateBbox = (points: [number, number][]) => {
  const lats = points.map(p => p[0]);
  const lngs = points.map(p => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  // Add buffer
  const latBuffer = (maxLat - minLat) * 0.2 || 0.01;
  const lngBuffer = (maxLng - minLng) * 0.2 || 0.01;
  
  return `${minLng - lngBuffer},${minLat - latBuffer},${maxLng + lngBuffer},${maxLat + latBuffer}`;
};

interface MarkerData {
  lat: number;
  lng: number;
  type: 'user' | 'from' | 'to' | 'rickshaw' | 'garbage';
  label?: string;
  id?: string;
}

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  location?: string;
  className?: string;
  eRickshaws?: ERickshaw[];
  garbageVehicles?: GarbageVehicle[];
  markers?: MarkerData[];
  userLocation?: [number, number];
  fromLocation?: [number, number];
  toLocation?: [number, number];
  routePath?: [number, number][];
}

export function InteractiveMap({
  latitude,
  longitude,
  location,
  className = "",
  eRickshaws = [],
  garbageVehicles = [],
  markers = [],
  userLocation,
  fromLocation,
  toLocation,
  routePath = [],
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<ERickshaw | GarbageVehicle | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeMap = () => {
      if (!mapRef.current) return;

      const mapContainer = mapRef.current;
      mapContainer.innerHTML = '';

      // If we have a route path, use Google Maps with directions
      if (routePath && routePath.length > 1 && fromLocation && toLocation) {
        const startCoord = `${routePath[0][0]},${routePath[0][1]}`;
        const endCoord = `${routePath[routePath.length - 1][0]},${routePath[routePath.length - 1][1]}`;
        
        // Create waypoints string for intermediate points
        const waypoints = routePath.slice(1, -1).map(point => `${point[0]},${point[1]}`).join('|');
        const waypointsParam = waypoints ? `&waypoints=${waypoints}` : '';
        
        // Google Maps Embed with Directions using your API key
        const googleMapsUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyDNSuDqVCi8A_k-v4PhorcKdO-3h88iubk&origin=${startCoord}&destination=${endCoord}${waypointsParam}&mode=walking&zoom=15`;
        
        const mapFrame = document.createElement('iframe');
        mapFrame.style.width = '100%';
        mapFrame.style.height = '100%';
        mapFrame.style.border = 'none';
        mapFrame.style.borderRadius = '8px';
        mapFrame.src = googleMapsUrl;
        
        // Add error handling
        mapFrame.onerror = () => {
          console.log('Google Maps failed, using OpenStreetMap fallback');
          mapContainer.innerHTML = '';
          const osmFrame = document.createElement('iframe');
          osmFrame.style.width = '100%';
          osmFrame.style.height = '100%';
          osmFrame.style.border = 'none';
          osmFrame.style.borderRadius = '8px';
          
          // Create route with all waypoints as markers
          const routeMarkers = routePath.map(point => `marker=${point[0]},${point[1]}`).join('&');
          const bbox = calculateBbox(routePath);
          const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&${routeMarkers}`;
          osmFrame.src = osmUrl;
          mapContainer.appendChild(osmFrame);
        };
        
        mapContainer.appendChild(mapFrame);
      } else {
        // Fallback to OpenStreetMap for regular map view
        const mapFrame = document.createElement('iframe');
        mapFrame.style.width = '100%';
        mapFrame.style.height = '100%';
        mapFrame.style.border = 'none';
        mapFrame.style.borderRadius = '8px';

        // Collect all points to include in bbox calculation
        const allPoints = [
          { lat: latitude, lng: longitude },
          ...eRickshaws,
          ...garbageVehicles,
          ...markers,
        ];

        // Add location markers if provided
        if (userLocation) allPoints.push({ lat: userLocation[0], lng: userLocation[1] });
        if (fromLocation) allPoints.push({ lat: fromLocation[0], lng: fromLocation[1] });
        if (toLocation) allPoints.push({ lat: toLocation[0], lng: toLocation[1] });

        // Calculate bbox to include all points
        let minLat = Math.min(...allPoints.map(p => p.lat));
        let maxLat = Math.max(...allPoints.map(p => p.lat));
        let minLng = Math.min(...allPoints.map(p => p.lng));
        let maxLng = Math.max(...allPoints.map(p => p.lng));

        // Add a buffer to the bbox
        const latBuffer = (maxLat - minLat) * 0.3 || 0.01;
        const lngBuffer = (maxLng - minLng) * 0.3 || 0.01;

        minLat -= latBuffer;
        maxLat += latBuffer;
        minLng -= lngBuffer;
        maxLng += lngBuffer;

        const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;

        // Create markers string for OpenStreetMap
        const osmMarkers = [];
        
        // Add user location marker
        if (userLocation) {
          osmMarkers.push(`marker=${userLocation[0]},${userLocation[1]}`);
        }
        
        // Add from location marker
        if (fromLocation) {
          osmMarkers.push(`marker=${fromLocation[0]},${fromLocation[1]}`);
        }
        
        // Add to location marker
        if (toLocation) {
          osmMarkers.push(`marker=${toLocation[0]},${toLocation[1]}`);
        }
        
        // Add vehicle markers
        [...eRickshaws, ...garbageVehicles].forEach(vehicle => {
          osmMarkers.push(`marker=${vehicle.lat},${vehicle.lng}`);
        });
        
        // Add custom markers
        markers.forEach(marker => {
          osmMarkers.push(`marker=${marker.lat},${marker.lng}`);
        });

        const markersString = osmMarkers.length > 0 ? `&${osmMarkers.join('&')}` : '';
        const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markersString}`;
        mapFrame.src = osmUrl;
        mapContainer.appendChild(mapFrame);
      }
    };

    const timer = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [latitude, longitude, eRickshaws, garbageVehicles, markers, userLocation, fromLocation, toLocation, routePath]);

  const handleVehicleClick = (vehicle: ERickshaw | GarbageVehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full min-h-[300px] bg-muted rounded-lg overflow-hidden"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>

      {/* Location Status Indicators */}
      <div className="absolute top-2 left-2 space-y-2 z-20">
        {/* Map Center Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <div className="text-xs">
              <div className="font-medium">{location || 'Map Center'}</div>
              <div className="text-muted-foreground">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>

        {/* User Location Status */}
        {userLocation && (
          <div className="bg-blue-500 text-white rounded-lg p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="text-xs font-medium">Your Location</div>
            </div>
          </div>
        )}

        {/* Route Status */}
        {routePath && routePath.length > 1 && (
          <div className="bg-orange-500 text-white rounded-lg p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="text-xs font-medium">Route Active</div>
            </div>
          </div>
        )}
      </div>


      {/* Native markers are now handled by OpenStreetMap */}

      {/* Selected Vehicle Popup */}
      {selectedVehicle && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 p-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-border/50 max-w-xs w-full">
          <h3 className="font-bold mb-2">
            {'driver' in selectedVehicle ? `E-Rickshaw: ${selectedVehicle.driver}` : `Garbage Vehicle: ${selectedVehicle.vehicleNo}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            Lat: {selectedVehicle.lat.toFixed(6)}, Lng: {selectedVehicle.lng.toFixed(6)}
          </p>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            &times;
          </button>
        </div>
      )}

      {/* Map controls overlay */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
        <div className="flex gap-1">
          <button
            className="p-1 hover:bg-gray-100 rounded text-xs"
            onClick={() => window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank')}
            title="Open in Google Maps"
          >
            🗺️
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded text-xs"
            onClick={() => {
              navigator.clipboard.writeText(`${latitude}, ${longitude}`);
              // You could add a toast notification here
            }}
            title="Copy coordinates"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
}

// Alternative simple map component for cases where iframe might not work
export function SimpleMap({ latitude, longitude, location, className = "" }: InteractiveMapProps) {
  const handleOpenInMaps = () => {
    // Try to open in the user's preferred map application
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const appleMapsUrl = `https://maps.apple.com/?q=${latitude},${longitude}`;
    // Detect if user is on iOS/Mac for Apple Maps, otherwise use Google Maps
    const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
    const mapUrl = isAppleDevice ? appleMapsUrl : googleMapsUrl;
    window.open(mapUrl, '_blank');
  };

  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(directionsUrl, '_blank');
  };

  return (
<div className={`relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-primary/20 ${className}`}>
<div className="p-6 text-center space-y-4">
<div className="relative">
<MapPin className="h-16 w-16 mx-auto text-primary animate-bounce" />
<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
</div>
<div>
<h3 className="font-semibold text-lg mb-2">{location || 'Report Location'}</h3>
<p className="text-sm text-muted-foreground mb-4">
            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
</p>
</div>
<div className="flex flex-col sm:flex-row gap-2 justify-center">
<button
            onClick={handleOpenInMaps}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
>
<MapPin className="h-4 w-4" />
            View in Maps
</button>
<button
            onClick={handleGetDirections}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
>
            🧭 Get Directions
</button>
</div>
<div className="text-xs text-muted-foreground">
          Click "View in Maps" to see the exact location
</div>
</div>
</div>
  );
}
