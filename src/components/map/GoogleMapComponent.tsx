import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { ERickshaw, ParkingLot, Alert } from '@/services/mockData';
import { locationService, LocationResult } from '@/lib/locationService';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin } from 'lucide-react';
// import { GoogleMap } from '@capacitor/google-maps';
import { Capacitor } from '@capacitor/core';

interface GoogleMapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
  activeFilter: 'all' | 'rickshaws' | 'parking' | 'alerts' | 'none';
  eRickshaws: ERickshaw[];
  parkingLots: ParkingLot[];
  alerts: Alert[];
  routePath?: { lat: number; lng: number }[];
  useCustomUserLocation?: boolean; // New prop to control location tracking
}

    const GOOGLE_MAPS_API_KEY = 'AIzaSyCnhWZO9IIbvcCJVQxDZu1SOeEiyFgpl54'
;
export function GoogleMapComponent({
  center,
  zoom,
  className = '',
  activeFilter,
  eRickshaws,
  parkingLots,
  alerts,
  routePath,
  useCustomUserLocation = false,
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const capacitorMapRef = useRef<any | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationResult | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

  const isNative = Capacitor.isNativePlatform();

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        if (isNative) {
          // Native initialization handled by Capacitor plugin
          setIsLoaded(true);
        } else {
          const loader = new Loader({
            apiKey: GOOGLE_MAPS_API_KEY,
            version: 'weekly',
            libraries: ['places']
          });

          await loader.load();
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setLocationError('Failed to load Google Maps. Please check your API key.');
      }
    };

    initMap();
  }, [isNative]);

  // Request location permissions on app launch
  useEffect(() => {
    const requestLocationPermission = async () => {
      // Only track real location if we're not using custom user location
      if (!useCustomUserLocation) {
      const hasPermission = await locationService.checkPermissions();
      if (hasPermission) {
        setLocationPermission(true);
        startLocationTracking();
      } else {
        setShowPermissionDialog(true);
        }
      } else {
        // If using custom location, set permission to true and use the center as user location
        setLocationPermission(true);
        const customLocation = { 
          latitude: center.lat, 
          longitude: center.lng, 
          accuracy: 0, 
          timestamp: Date.now() 
        };
        setUserLocation(customLocation);
        updateUserMarker(customLocation);
      }
    };

    if (isLoaded) {
      requestLocationPermission();
    }
  }, [isLoaded, useCustomUserLocation, center]);

  // Update user marker when center changes in custom location mode
  useEffect(() => {
    if (useCustomUserLocation && isLoaded && mapInstanceRef.current) {
      const customLocation = { 
        latitude: center.lat, 
        longitude: center.lng, 
        accuracy: 0, 
        timestamp: Date.now() 
      };
      updateUserMarker(customLocation);
      centerMapOnUser(customLocation);
    }
  }, [center, useCustomUserLocation, isLoaded]);

  // Create map instance
  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current && !capacitorMapRef.current) {
      if (isNative) {
        // Capacitor Google Maps integration would go here
        // For now, fall back to web implementation
        console.log('Native platform detected, but using web implementation');
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });
      } else {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });
      }

      // If using custom user location, create the user marker immediately
      if (useCustomUserLocation && mapInstanceRef.current) {
        const customLocation = { 
          latitude: center.lat, 
          longitude: center.lng, 
          accuracy: 0, 
          timestamp: Date.now() 
        };
        setTimeout(() => {
          updateUserMarker(customLocation);
        }, 100); // Small delay to ensure map is fully initialized
      }
    }
  }, [isLoaded, center, zoom, isNative, useCustomUserLocation]);

  // Start location tracking
  const startLocationTracking = async () => {
    const success = await locationService.watchPosition(
      (position) => {
        setUserLocation(position);
        updateUserMarker(position);
        centerMapOnUser(position);
      },
      (error) => {
        console.error('Location error:', error);
        let errorMessage = 'Unable to get your location. ';
        
        if (error.code === 1) {
          errorMessage += 'Please allow location access in your browser.';
        } else if (error.code === 2) {
          errorMessage += 'Location information is unavailable.';
        } else if (error.code === 3) {
          errorMessage += 'Location request timed out. Please try again.';
        } else {
          errorMessage += 'Please check your GPS settings and try again.';
        }
        
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    if (!success) {
      setLocationError('Failed to start location tracking.');
    }
  };

  // Handle permission request
  const handlePermissionRequest = async () => {
    try {
      setLocationError(''); // Clear any previous errors
    const granted = await locationService.requestPermissions();
    setLocationPermission(granted);
    setShowPermissionDialog(false);
    
    if (granted) {
      startLocationTracking();
    } else {
        setLocationError('Location permission denied. Please allow location access in your browser settings and try again.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationError('Failed to request location permission. Please check your browser settings.');
      setShowPermissionDialog(false);
    }
  };

  // Update user marker on map
  const updateUserMarker = (position: LocationResult) => {
    if (!isLoaded || (!mapInstanceRef.current && !capacitorMapRef.current)) return;

    const latLng = { lat: position.latitude, lng: position.longitude };

    if (mapInstanceRef.current) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition(latLng);
      } else {
        userMarkerRef.current = new google.maps.Marker({
          position: latLng,
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12, // Larger size
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3, // Thicker border
          },
          zIndex: 1000
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3 style="margin: 0; font-weight: bold;">${useCustomUserLocation ? 'Your Navigation Location' : 'Your Current Location'}</h3>
              <p style="margin: 5px 0; font-size: 12px;">
                ${useCustomUserLocation ? 'Navigated to this location' : `Accuracy: ${position.accuracy.toFixed(0)}m`}
              </p>
            </div>
          `
        });

        userMarkerRef.current.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, userMarkerRef.current);
        });
      }
    }
  };

  // Center map on user location
  const centerMapOnUser = (position: LocationResult) => {
    if (!isLoaded || (!mapInstanceRef.current && !capacitorMapRef.current)) return;
    
    const latLng = { lat: position.latitude, lng: position.longitude };

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(latLng);
      mapInstanceRef.current.setZoom(16);
    }
  };

  // Update markers based on filter
  useEffect(() => {
    if (!isLoaded || (!mapInstanceRef.current && !capacitorMapRef.current)) return;

    // Clear existing markers and their intervals
    if (mapInstanceRef.current) {
      markersRef.current.forEach(marker => {
        // Clear blinking interval if it exists
        if ((marker as any).blinkInterval) {
          clearInterval((marker as any).blinkInterval);
        }
        marker.setMap(null);
      });
      markersRef.current = [];
    }

    const newMarkers: google.maps.Marker[] = [];
    const nativeMarkersData: any[] = []; // Data for native markers to be added in a batch

    const createMarker = (position: { lat: number; lng: number }, title: string, iconUrl: string, type: string, infoContent: string) => {
      if (mapInstanceRef.current) {
        const marker = new google.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
          title: title,
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 32)
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
        newMarkers.push(marker);
      }
    };

    const createBlinkingRickshawMarker = (position: { lat: number; lng: number }, title: string, infoContent: string, rickshaw: any) => {
      if (mapInstanceRef.current) {
        console.log(`Creating e-rickshaw marker at position:`, position);
        console.log(`Map instance exists:`, !!mapInstanceRef.current);

        const marker = new google.maps.Marker({
          position: position, // Use exact same coordinates as user location
          map: mapInstanceRef.current,
          title: title,
          icon: {
            url: '/icons/e-rickshaw.png',
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16) // Center anchor point - icon centered on coordinates
          },
          zIndex: 1000, // Higher z-index for e-rickshaws
          visible: true // Explicitly set visible
        });

        console.log(`E-rickshaw marker created:`, marker);
        console.log(`Marker position:`, marker.getPosition()?.toJSON());

        // Create blinking animation - but start with visible
        let isVisible = true;
        marker.setVisible(true); // Ensure marker starts visible
        
        const blinkInterval = setInterval(() => {
          if (marker.getMap()) {
            isVisible = !isVisible;
            marker.setVisible(isVisible);
            console.log(`E-Rickshaw marker ${title} visibility:`, isVisible);
          } else {
            // Clear interval if marker is removed from map
            clearInterval(blinkInterval);
          }
        }, 800); // Blink every 800ms

        // Store interval reference to clear it later
        (marker as any).blinkInterval = blinkInterval;

        const infoWindow = new google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        newMarkers.push(marker);
      }
    };

    // Add E-Rickshaw markers with blinking animation - positioned close to user location
    console.log(`Active filter:`, activeFilter);
    console.log(`E-Rickshaws array:`, eRickshaws);
    console.log(`User location:`, userLocation);
    
    if (activeFilter === 'all' || activeFilter === 'rickshaws') {
      console.log(`Creating ${eRickshaws.length} e-rickshaw markers`);
      for (let i = 0; i < eRickshaws.length; i++) {
        const rickshaw = eRickshaws[i];
        
        // Position e-rickshaws at specific fixed coordinates (not at user location)
        const eRickshawCoordinates = [
          { lat: 23.165540, lng: 75.789840 }, // E-Rickshaw 1
          { lat: 23.164720, lng: 75.787960 }, // E-Rickshaw 2
          { lat: 23.165870, lng: 75.790150 }, // E-Rickshaw 3
          { lat: 23.166130, lng: 75.788200 }, // E-Rickshaw 4
          { lat: 23.164190, lng: 75.789430 }, // E-Rickshaw 5
          { lat: 23.166400, lng: 75.787890 }, // E-Rickshaw 6
          { lat: 23.165080, lng: 75.786950 }, // E-Rickshaw 7
          { lat: 23.163980, lng: 75.788710 }, // E-Rickshaw 8
          { lat: 23.164800, lng: 75.790980 }, // E-Rickshaw 9
          { lat: 23.166910, lng: 75.789610 }  // E-Rickshaw 10
        ];
        
        // Use fixed coordinates - no dependency on user location
        let rickshawPosition = eRickshawCoordinates[i] || eRickshawCoordinates[0];
        
        console.log(`E-Rickshaw ${rickshaw.id} (index ${i}) positioned at FIXED coordinates:`, rickshawPosition);
        
        const infoContent = `
          <div>
            <h3 style="margin: 0; font-weight: bold;">🛺 E-Rickshaw</h3>
            <p style="margin: 5px 0;"><strong>Driver:</strong> ${rickshaw.driver}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${rickshaw.status === 'available' ? 'green' : rickshaw.status === 'busy' ? 'orange' : 'red'};">${rickshaw.status}</span></p>
            <p style="margin: 5px 0; font-size: 12px;">
              📍 ${rickshawPosition.lat.toFixed(6)}, ${rickshawPosition.lng.toFixed(6)}
            </p>
          </div>
        `;
        console.log(`Creating marker for ${rickshaw.driver} at position:`, rickshawPosition);
        createBlinkingRickshawMarker(rickshawPosition, `E-Rickshaw - ${rickshaw.driver}`, infoContent, rickshaw);
      }
    }

    // Add Parking markers
    if (activeFilter === 'all' || activeFilter === 'parking') {
      for (const lot of parkingLots) {
        const infoContent = `
          <div>
            <h3 style="margin: 0; font-weight: bold;">Parking: ${lot.name}</h3>
            <p style="margin: 5px 0;"><strong>Available:</strong> ${lot.available}/${lot.capacity}</p>
            <p style="margin: 5px 0; font-size: 12px;">
              ${lot.lat.toFixed(6)}, ${lot.lng.toFixed(6)}
            </p>
          </div>
        `;
        createMarker({ lat: lot.lat, lng: lot.lng }, `Parking - ${lot.name}`, '/icons/parking-spot.png', 'parking', infoContent);
      }
    }

    // Add Alert markers
    if (activeFilter === 'all' || activeFilter === 'alerts') {
      for (const alert of alerts.filter(alert => alert.active)) {
        const infoContent = `
          <div>
            <h3 style="margin: 0; font-weight: bold;">Alert: ${alert.title}</h3>
            <p style="margin: 5px 0;"><strong>Area:</strong> ${alert.area}</p>
            <p style="margin: 5px 0;"><strong>Severity:</strong> ${alert.severity}</p>
            <p style="margin: 5px 0; font-size: 12px;">
              ${alert.lat.toFixed(6)}, ${alert.lng.toFixed(6)}
            </p>
          </div>
        `;
        createMarker({ lat: alert.lat, lng: alert.lng }, `Alert - ${alert.title}`, '/icons/alert-pin.png', 'alert', infoContent);
      }
    }

      markersRef.current = newMarkers;
  }, [activeFilter, eRickshaws, parkingLots, alerts, isLoaded, isNative]);

  // Update route using Google Directions API
  useEffect(() => {
    if (!isLoaded || (!mapInstanceRef.current && !capacitorMapRef.current)) return;

    // Clear existing directions
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    if (routePath && routePath.length >= 2 && mapInstanceRef.current) {
      // Initialize Directions Service and Renderer
      if (!directionsServiceRef.current) {
        directionsServiceRef.current = new google.maps.DirectionsService();
      }
      
      // Use simple straight polyline instead of directions API
      // Clear existing polyline
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      // Create straight line from origin to destination
      const origin = routePath[0];
      const destination = routePath[routePath.length - 1];
      
      polylineRef.current = new google.maps.Polyline({
        path: [origin, destination], // Simple straight line
        geodesic: true,
        strokeColor: '#FF6B35', // Orange color for e-rickshaw route
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: mapInstanceRef.current,
      });

      // Add start and end markers
      const startMarker = new google.maps.Marker({
        position: origin,
        map: mapInstanceRef.current,
        title: 'Start',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      const endMarker = new google.maps.Marker({
        position: destination,
        map: mapInstanceRef.current,
        title: 'Destination',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      // Auto-fit the map to show the route with proper bounds
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      
      // Calculate distance between points to determine if we need to expand bounds
      let distance = 1000; // Default to 1km if geometry library not available
      
      try {
        if (google.maps.geometry && google.maps.geometry.spherical) {
          distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(origin.lat, origin.lng),
            new google.maps.LatLng(destination.lat, destination.lng)
          );
        } else {
          // Fallback: simple distance calculation
          const latDiff = Math.abs(origin.lat - destination.lat);
          const lngDiff = Math.abs(origin.lng - destination.lng);
          distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // Rough conversion to meters
        }
      } catch (error) {
        console.log('Distance calculation failed, using default bounds');
      }
      
      // If points are too close (less than 1km), expand the bounds to show more area
      if (distance < 1000) {
        const expandBy = 0.005; // Roughly 500m
        bounds.extend({
          lat: origin.lat + expandBy,
          lng: origin.lng + expandBy
        });
        bounds.extend({
          lat: origin.lat - expandBy,
          lng: origin.lng - expandBy
        });
        bounds.extend({
          lat: destination.lat + expandBy,
          lng: destination.lng + expandBy
        });
        bounds.extend({
          lat: destination.lat - expandBy,
          lng: destination.lng - expandBy
        });
      }
      
      // Add padding to prevent UI elements from covering markers
      const padding = {
        top: 80,
        right: 50,
        bottom: 200, // More bottom padding for route options
        left: 50
      };
      
      mapInstanceRef.current?.fitBounds(bounds, padding);
      
      // Ensure the map doesn't zoom in too much after fitting bounds
      setTimeout(() => {
        if (mapInstanceRef.current) {
          const currentZoom = mapInstanceRef.current.getZoom();
          if (currentZoom && currentZoom > 15) {
            mapInstanceRef.current.setZoom(15); // Set reasonable zoom level
          }
        }
      }, 200);
    }
  }, [routePath, isLoaded, isNative]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      locationService.clearWatch();
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  // The permission dialog and error messages remain the same
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

  return (
    <div className={`h-full w-full ${className}`}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      {userLocation && (
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <p className="text-xs text-muted-foreground">
            Accuracy: {userLocation.accuracy.toFixed(0)}m
          </p>
        </div>
      )}
    </div>
  );
  }