import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FestivalButton } from "@/components/ui/festival-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  Zap, 
  Route,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { generateMockRoute } from "@/services/mockData";
import { cn } from "@/lib/utils";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { GoogleMapComponent } from "@/components/map/GoogleMapComponent";
import { locationService } from "@/lib/locationService";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

// Real coordinates for Ujjain locations
const locationCoordinates: { [key: string]: [number, number] } = {
  "Railway Station": [23.1837, 75.7924],
  "Ramghat": [23.1794, 75.7886],
  "Mahakaleshwar Temple": [23.1765, 75.7885],
  "Kal Bhairav Temple": [23.1756, 75.7863],
  "Bus Station": [23.1798, 75.7845],
  "Dewas Road": [23.1812, 75.7932],
  "Parking Zone A": [23.1789, 75.7901],
  "Parking Zone B": [23.1771, 75.7868],
};

const UJJAIN_CENTER: [number, number] = [23.1795, 75.7885]; // Default Ujjain coordinates

const commonPlaces = [
  "Railway Station",
  "Ramghat",
  "Mahakaleshwar Temple", 
  "Kal Bhairav Temple",
  "Bus Station",
  "Dewas Road",
  "Parking Zone A",
  "Parking Zone B"
];

// Function to generate realistic route path with waypoints
const generateRoutePath = (
  fromCoords: [number, number], 
  toCoords: [number, number], 
  fromLocation: string, 
  toLocation: string
): [number, number][] => {
  const path: [number, number][] = [fromCoords];
  
  // Define main roads/intersections in Ujjain for routing
  const mainRoads = {
    "Temple Road": [23.1770, 75.7880],
    "Main Market": [23.1780, 75.7890],
    "Station Road": [23.1800, 75.7900],
    "Ramghat Road": [23.1785, 75.7895],
  };
  
  // Add waypoints based on common routes between locations
  const routeMap: { [key: string]: [number, number][] } = {
    // From Railway Station
    "Railway Station->Mahakaleshwar Temple": [[23.1800, 75.7900], [23.1780, 75.7890], [23.1770, 75.7880]],
    "Railway Station->Ramghat": [[23.1800, 75.7900], [23.1790, 75.7895]],
    "Railway Station->Kal Bhairav Temple": [[23.1800, 75.7900], [23.1780, 75.7885], [23.1760, 75.7875]],
    
    // From Mahakaleshwar Temple
    "Mahakaleshwar Temple->Railway Station": [[23.1770, 75.7880], [23.1780, 75.7890], [23.1800, 75.7900]],
    "Mahakaleshwar Temple->Ramghat": [[23.1770, 75.7880], [23.1775, 75.7885]],
    "Mahakaleshwar Temple->Bus Station": [[23.1770, 75.7880], [23.1755, 75.7870]],
    
    // From Ramghat
    "Ramghat->Mahakaleshwar Temple": [[23.1780, 75.7890], [23.1775, 75.7885]],
    "Ramghat->Railway Station": [[23.1785, 75.7895], [23.1800, 75.7905]],
    "Ramghat->Kal Bhairav Temple": [[23.1785, 75.7895], [23.1770, 75.7885], [23.1760, 75.7875]],
    
    // From Bus Station
    "Bus Station->Mahakaleshwar Temple": [[23.1745, 75.7865], [23.1755, 75.7870], [23.1765, 75.7880]],
    "Bus Station->Railway Station": [[23.1745, 75.7865], [23.1780, 75.7890], [23.1810, 75.7905]],
    
    // Parking routes
    "Parking Zone A->Mahakaleshwar Temple": [[23.1785, 75.7895], [23.1775, 75.7885]],
    "Parking Zone B->Ramghat": [[23.1775, 75.7865], [23.1780, 75.7885]],
  };
  
  // Create route key
  const routeKey = `${fromLocation}->${toLocation}`;
  const reverseRouteKey = `${toLocation}->${fromLocation}`;
  
  // Check if we have a predefined route
  if (routeMap[routeKey]) {
    path.push(...routeMap[routeKey]);
  } else if (routeMap[reverseRouteKey]) {
    // Use reverse route and reverse the waypoints
    const reverseWaypoints = [...routeMap[reverseRouteKey]].reverse();
    path.push(...reverseWaypoints);
  } else {
    // Generate intermediate waypoints for unknown routes
    const latDiff = toCoords[0] - fromCoords[0];
    const lngDiff = toCoords[1] - fromCoords[1];
    
    // Add 2-3 waypoints to make the route look more realistic
    if (Math.abs(latDiff) > 0.001 || Math.abs(lngDiff) > 0.001) {
      // First waypoint (1/3 of the way)
      path.push([
        fromCoords[0] + latDiff * 0.33,
        fromCoords[1] + lngDiff * 0.33
      ]);
      
      // Second waypoint (2/3 of the way, slightly offset for realism)
      path.push([
        fromCoords[0] + latDiff * 0.67 + (Math.random() - 0.5) * 0.001,
        fromCoords[1] + lngDiff * 0.67 + (Math.random() - 0.5) * 0.001
      ]);
    }
  }
  
  // Add destination
  path.push(toCoords);
  
  return path;
};

export default function PlanRoute() {
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState("");
  const [routeData, setRouteData] = useState<any>(null);
  const [routeType, setRouteType] = useState<'walking' | 'rickshaw'>('walking');
  const [routePath, setRoutePath] = useState<[number, number][] | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [suggestedFromLocation, setSuggestedFromLocation] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(UJJAIN_CENTER);
  
  // Google Maps API hook
  const { isValid: isApiValid, error: apiError, getDirectionsUrl } = useGoogleMaps();

  // Auto-detect user location for "From" field
  useEffect(() => {
    const updateFromLocation = async () => {
      try {
        const position = await locationService.getCurrentPosition();
        if (position) {
          const currentLocString = `Current Location (${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)})`;
          const userCoords: [number, number] = [position.latitude, position.longitude];
          setUserLocation(userCoords);
          setMapCenter(userCoords);
          setFromLocation(currentLocString);
          setSuggestedFromLocation(currentLocString);
        }
      } catch (error) {
        console.log('Location detection failed, using default location');
        // Fallback to default Ujjain location if location fails
        setFromLocation('Mahakaleshwar Temple');
        setMapCenter(UJJAIN_CENTER);
      }
    };
    
    updateFromLocation();
  }, []);

  const handlePlanRoute = () => {
    if (fromLocation && toLocation) {
      let fromCoords: [number, number] | undefined;
      if (fromLocation === suggestedFromLocation && userLocation) {
        fromCoords = userLocation;
      } else {
        fromCoords = locationCoordinates[fromLocation];
      }
      const toCoords = locationCoordinates[toLocation];

      if (fromCoords && toCoords) {
        console.log('Planning route from:', fromLocation, fromCoords, 'to:', toLocation, toCoords);
        
        // Create realistic route path with waypoints based on actual locations
        const path = generateRoutePath(fromCoords, toCoords, fromLocation, toLocation);
        console.log('Generated route path:', path);
        setRoutePath(path);

        // Center map to show both points
        const centerLat = (fromCoords[0] + toCoords[0]) / 2;
        const centerLng = (fromCoords[1] + toCoords[1]) / 2;
        console.log('Setting map center to:', [centerLat, centerLng]);
        setMapCenter([centerLat, centerLng]);

        // Calculate distance using Haversine formula for more accuracy
        const R = 6371; // Earth's radius in km
        const dLat = (toCoords[0] - fromCoords[0]) * Math.PI / 180;
        const dLng = (toCoords[1] - fromCoords[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(fromCoords[0] * Math.PI / 180) * Math.cos(toCoords[0] * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km

        const mockRoute = {
          ...generateMockRoute(fromLocation, toLocation),
          distance: parseFloat(distance.toFixed(2)),
          duration: Math.round(distance * 12), // 12 minutes per km walking speed
        };
        console.log('Route data:', mockRoute);
        setRouteData(mockRoute);

      } else {
        alert("Please select valid 'From' and 'To' locations from the suggestions.");
        setRouteData(null);
        setRoutePath(undefined);
      }
    } else {
      setRouteData(null);
      setRoutePath(undefined);
    }
  };

  const getCrowdBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };


  return (
    <div className={`${toLocation ? 'flex flex-col min-h-screen' : 'fixed inset-0'} bg-gray-100 overflow-hidden`}>
      {/* Working Map Section */}
      <div className={`relative z-0 ${toLocation ? 'h-[60vh]' : 'w-full h-full'} transition-all duration-300`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 relative">
          {routeData && routePath && routeType === 'walking' ? (
            <div className="w-full h-full relative">
              {/* Google Maps with smart API handling */}
              <iframe
                src={getDirectionsUrl(routePath[0], routePath[routePath.length - 1])}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Route Directions"
              />
              
              {/* Route info overlay */}
              <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-30">
                <div className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-blue-600">📍</span>
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{fromLocation}</span>
                    <span className="text-gray-500 flex-shrink-0">→</span>
                    <span className="truncate max-w-[120px] sm:max-w-[200px] text-black font-semibold">{toLocation}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 flex items-center gap-2">
                  <span>{routeData.distance} km</span>
                  <span>•</span>
                  <span>{routeType === 'walking' ? routeData.duration + ' min walk' : Math.round(routeData.duration / 3) + ' min ride'}</span>
                </div>
              </div>
              
            </div>
          ) : (
            <GoogleMapComponent
              center={{ lat: mapCenter[0], lng: mapCenter[1] }}
              zoom={15}
              className="w-full h-full"
              activeFilter={routeType === 'rickshaw' ? 'rickshaws' : 'all'}
              eRickshaws={routeType === 'rickshaw' && routeData ? [
                {
                  id: 'rick_001',
                  driver: 'Raj Kumar',
                  lat: userLocation ? userLocation[0] + 0.0005 : mapCenter[0] + 0.0005,
                  lng: userLocation ? userLocation[1] + 0.0003 : mapCenter[1] + 0.0003,
                  status: 'available' as const,
                  distance: 0.1,
                  eta: 3
                },
                {
                  id: 'rick_002',
                  driver: 'Amit Singh',
                  lat: userLocation ? userLocation[0] - 0.0003 : mapCenter[0] - 0.0003,
                  lng: userLocation ? userLocation[1] + 0.0006 : mapCenter[1] + 0.0006,
                  status: 'available' as const,
                  distance: 0.15,
                  eta: 5
                },
                {
                  id: 'rick_003',
                  driver: 'Suresh Patel',
                  lat: userLocation ? userLocation[0] + 0.0008 : mapCenter[0] + 0.0008,
                  lng: userLocation ? userLocation[1] - 0.0002 : mapCenter[1] - 0.0002,
                  status: 'available' as const,
                  distance: 0.08,
                  eta: 2
                },
                {
                  id: 'rick_004',
                  driver: 'Vikash Sharma',
                  lat: userLocation ? userLocation[0] - 0.0006 : mapCenter[0] - 0.0006,
                  lng: userLocation ? userLocation[1] - 0.0004 : mapCenter[1] - 0.0004,
                  status: 'available' as const,
                  distance: 0.12,
                  eta: 4
                },
                {
                  id: 'rick_005',
                  driver: 'Ramesh Kumar',
                  lat: userLocation ? userLocation[0] + 0.0004 : mapCenter[0] + 0.0004,
                  lng: userLocation ? userLocation[1] + 0.0007 : mapCenter[1] + 0.0007,
                  status: 'available' as const,
                  distance: 0.09,
                  eta: 3
                }
              ] : []}
              parkingLots={[]}
              alerts={[]}
              routePath={routeType === 'rickshaw' && routeData && routePath ? routePath.map(point => ({ lat: point[0], lng: point[1] })) : undefined}
            />
          )}
        </div>
        
        {/* Map Controls */}
        <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-2">
          {/* Center on User Location Button */}
          {userLocation && (
            <button
              onClick={() => setMapCenter(userLocation)}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </button>
          )}
          
          {/* Zoom to Fit Route Button */}
          {routePath && routePath.length > 1 && (
            <button
              onClick={() => {
                const centerLat = (routePath[0][0] + routePath[1][0]) / 2;
                const centerLng = (routePath[0][1] + routePath[1][1]) / 2;
                setMapCenter([centerLat, centerLng]);
              }}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Navigation className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Top Search Card - Google Maps Style */}
      {!routeData && (
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/95">
            <CardContent className="p-0">
              {/* From Location */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-700">From</span>
                </div>
                <div className="ml-5">
                  <Input
                    placeholder="Your location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="border-0 bg-transparent text-gray-900 placeholder-gray-500 text-base font-medium focus:ring-0 p-0 h-auto"
                    list="from-suggestions"
                  />
                  <datalist id="from-suggestions">
                    {userLocation && (
                      <option value={`Current Location (${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)})`} />
                    )}
                    {commonPlaces.map((place) => (
                      <option key={place} value={place} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* To Location */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-700">To</span>
                </div>
                <div className="ml-5">
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger className="border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0">
                      <SelectValue placeholder="Choose destination" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-xl z-[1100]">
                      {commonPlaces.map((place) => (
                        <SelectItem key={place} value={place} className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{place}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


      {/* Bottom Action Button */}
      {fromLocation && toLocation && !routeData && (
        <div className="absolute bottom-24 left-4 right-4 z-[1000]">
          <FestivalButton 
            onClick={handlePlanRoute}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-2xl py-4 text-lg font-semibold backdrop-blur-sm"
            size="lg"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Get Directions
          </FestivalButton>
        </div>
      )}


      {/* Route Results Section */}
      {routeData && (
        <div className="flex-1 bg-white border-t border-gray-200 overflow-y-auto mb-20">
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 text-center">Route Options</h3>

            {/* Walking Route */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Walking</div>
                    <div className="text-sm text-gray-500">Safest route</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{routeData.duration} min</div>
                  <div className="text-sm text-gray-500">{routeData.distance} km</div>
                </div>
              </div>

              {routeData.crowdLevel === 'high' && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-200 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-800">
                    High crowd expected. Consider alternate route.
                  </span>
                </div>
              )}

              <button 
                onClick={() => setRouteType('walking')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Choose Walking Route
              </button>
            </div>

            {/* E-Rickshaw Route */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">E-Rickshaw</div>
                    <div className="text-sm text-gray-500">Fastest route</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{Math.round(routeData.duration / 3)} min</div>
                  <div className="text-sm text-gray-500">{routeData.distance} km</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200 mb-3">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">
                  E-rickshaws available nearby
                </span>
              </div>

              <button 
                onClick={() => setRouteType('rickshaw')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Choose E-Rickshaw Route
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}