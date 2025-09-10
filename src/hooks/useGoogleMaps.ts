import { useState, useEffect } from 'react';

interface GoogleMapsConfig {
  apiKey: string;
  isValid: boolean;
  error: string | null;
}

export const useGoogleMaps = () => {
  const [config, setConfig] = useState<GoogleMapsConfig>({
    apiKey: 'AIzaSyDNSuDqVCi8A_k-v4PhorcKdO-3h88iubk',
    isValid: false,
    error: null
  });

  useEffect(() => {
    // Test the API key by making a simple request
    const testApiKey = async () => {
      try {
        // Test with a simple geocoding request
        const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Ujjain&key=${config.apiKey}`;
        const response = await fetch(testUrl);
        const data = await response.json();
        
        if (data.status === 'OK') {
          setConfig(prev => ({ ...prev, isValid: true, error: null }));
        } else if (data.status === 'REQUEST_DENIED') {
          setConfig(prev => ({ 
            ...prev, 
            isValid: false, 
            error: 'API key is invalid or restricted' 
          }));
        } else if (data.status === 'OVER_QUERY_LIMIT') {
          setConfig(prev => ({ 
            ...prev, 
            isValid: false, 
            error: 'API quota exceeded' 
          }));
        } else {
          setConfig(prev => ({ 
            ...prev, 
            isValid: false, 
            error: `API Error: ${data.status}` 
          }));
        }
      } catch (error) {
        setConfig(prev => ({ 
          ...prev, 
          isValid: false, 
          error: 'Network error - check internet connection' 
        }));
      }
    };

    testApiKey();
  }, [config.apiKey]);

  const getDirectionsUrl = (origin: [number, number], destination: [number, number]) => {
    if (config.isValid) {
      // Use Embed API with valid key
      return `https://www.google.com/maps/embed/v1/directions?key=${config.apiKey}&origin=${origin[0]},${origin[1]}&destination=${destination[0]},${destination[1]}&mode=walking&zoom=15`;
    } else {
      // Fallback to regular Google Maps
      return `https://www.google.com/maps?saddr=${origin[0]},${origin[1]}&daddr=${destination[0]},${destination[1]}&dirflg=w&output=embed&z=15`;
    }
  };

  const getStaticMapUrl = (center: [number, number], markers: [number, number][]) => {
    if (config.isValid) {
      const markersParam = markers.map((marker, index) => 
        `markers=color:${index === 0 ? 'blue' : 'red'}%7C${marker[0]},${marker[1]}`
      ).join('&');
      
      return `https://maps.googleapis.com/maps/api/staticmap?center=${center[0]},${center[1]}&zoom=14&size=600x400&${markersParam}&key=${config.apiKey}`;
    }
    return null;
  };

  return {
    ...config,
    getDirectionsUrl,
    getStaticMapUrl
  };
};
