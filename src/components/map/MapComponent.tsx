import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ERickshaw, ParkingLot, Alert } from '@/services/mockData';
import { locationService, LocationResult } from '@/lib/locationService';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin } from 'lucide-react';

// Workaround for leaflet default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Custom icons (removed garbage icon as requested)
const eRickshawIcon = new L.Icon({
  iconUrl: '/icons/e-rickshaw.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16], // Changed from [16, 32] to [16, 16] - moves icon down
  popupAnchor: [0, -16], // Adjusted popup anchor accordingly
  className: 'e-rickshaw-icon' // Add custom class for additional styling
});

const parkingIcon = new L.Icon({
  iconUrl: '/icons/parking-spot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const alertIcon = new L.Icon({
  iconUrl: '/icons/alert-pin.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userLocationIcon = new L.Icon({
  iconUrl: '/icons/user-pin.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'user-location-marker'
});

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  className?: string;
  activeFilter: 'all' | 'rickshaws' | 'parking' | 'alerts' | 'none';
  eRickshaws: ERickshaw[];
  parkingLots: ParkingLot[];
  alerts: Alert[];
  routePath?: [number, number][];
}

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export function MapComponent({
  center,
  zoom,
  className = '',
  activeFilter,
  eRickshaws,
  parkingLots,
  alerts,
  routePath,
}: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<LocationResult | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  // Request location permissions on component mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      setIsLocationLoading(true);
      
      const hasPermission = await locationService.checkPermissions();
      if (hasPermission) {
        setLocationPermission(true);
        startLocationTracking();
      } else {
        setShowPermissionDialog(true);
        setIsLocationLoading(false);
      }
    };

    requestLocationPermission();

    return () => {
      locationService.clearWatch();
    };
  }, []);

  // Start location tracking
  const startLocationTracking = async () => {
    const success = await locationService.watchPosition(
      (position) => {
        setUserLocation(position);
        // Center map on user location when first detected
        if (isLocationLoading) {
          setMapCenter([position.latitude, position.longitude]);
          setIsLocationLoading(false);
        }
      },
      (error) => {
        setLocationError('Unable to get your location. Please check your GPS settings.');
        setIsLocationLoading(false);
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    if (!success) {
      setLocationError('Failed to start location tracking.');
      setIsLocationLoading(false);
    }
  };

  // Handle permission request
  const handlePermissionRequest = async () => {
    const granted = await locationService.requestPermissions();
    setLocationPermission(granted);
    setShowPermissionDialog(false);
    
    if (granted) {
      startLocationTracking();
    } else {
      setLocationError('Location permission is required for proper app usage. Please enable location access in your device settings.');
      setIsLocationLoading(false);
    }
  };

  // Filter markers based on activeFilter and position them near user location
  const filteredERickshaws = useMemo(() => {
    if (activeFilter !== 'all' && activeFilter !== 'rickshaws') return [];
    
    // If user location is available, position e-rickshaws closer to user
    if (userLocation) {
      return eRickshaws.map((rickshaw, index) => {
        // Use consistent offsets based on rickshaw ID to avoid jumping positions
        const rickshawNumber = parseInt(rickshaw.id.replace(/\D/g, '')) || (index + 1);
        
        // Create tiny offsets around user location (almost overlapping)
        const angle = (rickshawNumber * 72) % 360; // Different angles for each rickshaw (72° apart)
        
        // Use extremely small offsets - almost zero but still visible
        const baseOffset = 0.00001; // Very small base offset
        const variableOffset = (rickshawNumber % 3) * 0.000005; // Tiny variation
        const totalOffset = baseOffset + variableOffset;
        
        const angleRad = (angle * Math.PI) / 180;
        const latOffset = Math.cos(angleRad) * totalOffset;
        const lngOffset = Math.sin(angleRad) * totalOffset;
        
        return {
          ...rickshaw,
          lat: userLocation.latitude + latOffset,
          lng: userLocation.longitude + lngOffset
        };
      });
    }
    
    // Fallback to original positions if no user location
    return eRickshaws;
  }, [activeFilter, eRickshaws, userLocation]);

  const filteredParkingLots = useMemo(() => {
    return activeFilter === 'all' || activeFilter === 'parking' ? parkingLots : [];
  }, [activeFilter, parkingLots]);

  const filteredAlerts = useMemo(() => {
    return activeFilter === 'all' || activeFilter === 'alerts' ? alerts.filter(a => a.active) : [];
  }, [activeFilter, alerts]);

  // Show permission dialog
  if (showPermissionDialog) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${className}`}>
        <div className="text-center p-6 max-w-sm mx-auto">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Enable Location Access</h3>
          <p className="text-muted-foreground mb-6">
            We need access to your location to show your position on the map and provide accurate navigation.
          </p>
          <Button onClick={handlePermissionRequest} className="w-full">
            Enable Location
          </Button>
        </div>
      </div>
    );
  }

  // Show location error
  if (locationError) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${className}`}>
        <div className="text-center p-6 max-w-sm mx-auto">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Location Error</h3>
          <p className="text-muted-foreground mb-6">{locationError}</p>
          <Button 
            onClick={() => {
              setLocationError('');
              startLocationTracking();
            }} 
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLocationLoading) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        {...({center: mapCenter, zoom: userLocation ? 16 : zoom, scrollWheelZoom: true} as any)}
        style={{ height: '100%', width: '100%' }}
      >
        <MapUpdater center={mapCenter} zoom={userLocation ? 16 : zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker with custom styling */}
        {userLocation && (
          <Marker 
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon as any}
          >
            <Popup>
              <div>
                <h3 className="font-bold">Your Current Location</h3>
                <p className="text-sm">Accuracy: {userLocation.accuracy.toFixed(0)}m</p>
                <p className="text-xs text-muted-foreground">
                  {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route polyline */}
        {routePath && routePath.length > 0 && (
          <Polyline positions={routePath} pathOptions={{color: "#FF7F50", weight: 4, opacity: 0.7}} />
        )}

        {/* E-Rickshaw markers */}
        {filteredERickshaws.map((rickshaw) => (
          <Marker key={rickshaw.id} position={[rickshaw.lat, rickshaw.lng]} icon={eRickshawIcon as any}>
            <Popup>
              <div>
                <h3 className="font-bold">E-Rickshaw</h3>
                <p className="text-sm"><strong>Driver:</strong> {rickshaw.driver}</p>
                <p className="text-sm"><strong>Status:</strong> {rickshaw.status}</p>
                <p className="text-xs text-muted-foreground">
                  {rickshaw.lat.toFixed(6)}, {rickshaw.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Parking markers */}
        {filteredParkingLots.map((lot) => (
          <Marker key={lot.id} position={[lot.lat, lot.lng]} icon={parkingIcon as any}>
            <Popup>
              <div>
                <h3 className="font-bold">Parking: {lot.name}</h3>
                <p className="text-sm"><strong>Available:</strong> {lot.available}/{lot.capacity}</p>
                <p className="text-xs text-muted-foreground">
                  {lot.lat.toFixed(6)}, {lot.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Alert markers */}
        {filteredAlerts.map((alert) => (
          <Marker key={alert.id} position={[alert.lat, alert.lng]} icon={alertIcon as any}>
            <Popup>
              <div>
                <h3 className="font-bold">Alert: {alert.title}</h3>
                <p className="text-sm"><strong>Area:</strong> {alert.area}</p>
                <p className="text-sm"><strong>Severity:</strong> {alert.severity}</p>
                <p className="text-xs text-muted-foreground">
                  {alert.lat.toFixed(6)}, {alert.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Location accuracy indicator */}
      {userLocation && (
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            GPS: {userLocation.accuracy.toFixed(0)}m
          </p>
        </div>
      )}
    </div>
  );
}