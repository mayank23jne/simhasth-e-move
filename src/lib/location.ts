export const fetchCurrentLocation = (onLocationChange: (latitude: number, longitude: number) => void) => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onLocationChange(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      console.error('Error getting location:', error);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );

  return () => navigator.geolocation.clearWatch(watchId);
};
