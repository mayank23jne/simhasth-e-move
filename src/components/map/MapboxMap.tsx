import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockERickshaws, mockParkingLots, mockCrowdData } from '@/services/mockData';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// Mapbox token input component
const MapboxTokenInput = ({ onTokenSubmit }: { onTokenSubmit: (token: string) => void }) => {
  const [token, setToken] = useState('');
  
  return (
    <Card className="p-4 m-4">
      <div className="space-y-3">
        <h3 className="font-semibold">Enter Mapbox Token</h3>
        <p className="text-sm text-muted-foreground">
          Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
        </p>
        <Input
          type="password"
          placeholder="pk.eyJ1..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && token && onTokenSubmit(token)}
        />
        <button 
          onClick={() => token && onTokenSubmit(token)}
          disabled={!token}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md disabled:opacity-50"
        >
          Load Map
        </button>
      </div>
    </Card>
  );
};

interface MapboxMapProps {
  showRickshaws?: boolean;
  showParking?: boolean;
  showHeatmap?: boolean;
  fromLocation?: string;
  toLocation?: string;
  onRouteCalculated?: (route: any) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  showRickshaws = false,
  showParking = false,
  showHeatmap = false,
  fromLocation,
  toLocation,
  onRouteCalculated
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [rickshawMarkers, setRickshawMarkers] = useState<mapboxgl.Marker[]>([]);
  const [parkingMarkers, setParkingMarkers] = useState<mapboxgl.Marker[]>([]);

  // Ujjain coordinates
  const UJJAIN_CENTER: [number, number] = [75.7885, 23.1765];

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: UJJAIN_CENTER,
      zoom: 14,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocation control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update rickshaw markers
  useEffect(() => {
    if (!map.current || !showRickshaws) {
      rickshawMarkers.forEach(marker => marker.remove());
      setRickshawMarkers([]);
      return;
    }

    // Clear existing markers
    rickshawMarkers.forEach(marker => marker.remove());

    const newMarkers = mockERickshaws
      .filter(rickshaw => rickshaw.status === 'available')
      .map(rickshaw => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'rickshaw-marker';
        el.style.cssText = `
          width: 30px;
          height: 30px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          animation: pulse 2s infinite;
        `;
        el.innerHTML = '🛺';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([rickshaw.lng, rickshaw.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${rickshaw.driver}</h3>
                <p class="text-sm">ETA: ${rickshaw.eta} min</p>
                <p class="text-sm">Distance: ${rickshaw.distance} km</p>
                ${rickshaw.fare ? `<p class="text-sm">Fare: ₹${rickshaw.fare}</p>` : ''}
              </div>
            `)
          )
          .addTo(map.current!);

        return marker;
      });

    setRickshawMarkers(newMarkers);
  }, [showRickshaws, map.current]);

  // Update parking markers
  useEffect(() => {
    if (!map.current || !showParking) {
      parkingMarkers.forEach(marker => marker.remove());
      setParkingMarkers([]);
      return;
    }

    // Clear existing markers
    parkingMarkers.forEach(marker => marker.remove());

    const newMarkers = mockParkingLots.map(lot => {
      const availabilityPercentage = (lot.available / lot.capacity) * 100;
      const color = availabilityPercentage > 50 ? '#10b981' : availabilityPercentage > 20 ? '#f59e0b' : '#ef4444';

      const el = document.createElement('div');
      el.className = 'parking-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background: ${color};
        border: 2px solid white;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        font-weight: bold;
        color: white;
        font-size: 12px;
      `;
      el.innerHTML = 'P';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lot.lng, lot.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${lot.name}</h3>
              <p class="text-sm">Available: ${lot.available}/${lot.capacity}</p>
              <p class="text-sm">Distance: ${lot.distance} km</p>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-${color === '#10b981' ? 'green' : color === '#f59e0b' ? 'yellow' : 'red'}-500 h-2 rounded-full" style="width: ${availabilityPercentage}%"></div>
                </div>
              </div>
            </div>
          `)
        )
        .addTo(map.current!);

      return marker;
    });

    setParkingMarkers(newMarkers);
  }, [showParking, map.current]);

  // Add heatmap layer
  useEffect(() => {
    if (!map.current) return;

    map.current.on('load', () => {
      if (showHeatmap && !map.current!.getSource('crowd-heatmap')) {
        // Add heatmap source
        map.current!.addSource('crowd-heatmap', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: mockCrowdData.map(crowd => ({
              type: 'Feature',
              properties: {
                density: crowd.density === 'low' ? 1 : crowd.density === 'medium' ? 3 : crowd.density === 'high' ? 5 : 7
              },
              geometry: {
                type: 'Point',
                coordinates: [crowd.lng, crowd.lat]
              }
            }))
          }
        });

        // Add heatmap layer
        map.current!.addLayer({
          id: 'crowd-heatmap-layer',
          type: 'heatmap',
          source: 'crowd-heatmap',
          maxzoom: 15,
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'density'],
              0, 0,
              7, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              15, 3
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              15, 60
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              15, 0.5
            ]
          }
        });
      } else if (!showHeatmap && map.current!.getLayer('crowd-heatmap-layer')) {
        map.current!.removeLayer('crowd-heatmap-layer');
        map.current!.removeSource('crowd-heatmap');
      }
    });
  }, [showHeatmap, map.current]);

  // Handle route calculation
  useEffect(() => {
    if (!map.current || !fromLocation || !toLocation) return;

    // Mock route calculation - in real app, use Mapbox Directions API
    const mockRoute = {
      distance: Math.round(Math.random() * 5 + 1),
      duration: Math.round(Math.random() * 30 + 10),
      crowdLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      coordinates: [
        UJJAIN_CENTER,
        [UJJAIN_CENTER[0] + 0.01, UJJAIN_CENTER[1] + 0.01],
        [UJJAIN_CENTER[0] + 0.02, UJJAIN_CENTER[1] + 0.005],
        [UJJAIN_CENTER[0] + 0.025, UJJAIN_CENTER[1] - 0.01]
      ]
    };

    // Add route line
    if (map.current.getSource('route')) {
      map.current.removeLayer('route-line');
      map.current.removeSource('route');
    }

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: mockRoute.coordinates
        }
      }
    });

    map.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ea580c',
        'line-width': 4
      }
    });

    // Add start and end markers
    new mapboxgl.Marker({ color: '#10b981' })
      .setLngLat(mockRoute.coordinates[0] as [number, number])
      .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>Start:</strong> ${fromLocation}</div>`))
      .addTo(map.current);

    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(mockRoute.coordinates[mockRoute.coordinates.length - 1] as [number, number])
      .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>End:</strong> ${toLocation}</div>`))
      .addTo(map.current);

    // Fit map to route
    const bounds = new mapboxgl.LngLatBounds();
    mockRoute.coordinates.forEach(coord => bounds.extend(coord as [number, number]));
    map.current.fitBounds(bounds, { padding: 50 });

    onRouteCalculated?.(mockRoute);
  }, [fromLocation, toLocation, map.current]);

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={setMapboxToken} />;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          .rickshaw-marker {
            animation: pulse 2s infinite;
          }
        `
      }} />
    </div>
  );
};

export default MapboxMap;