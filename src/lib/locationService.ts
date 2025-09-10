import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export class LocationService {
  private watchId: string | number | null = null;
  private permissionStatus: PermissionStatus | null = null;
  private isNative: boolean;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (this.isNative) {
        this.permissionStatus = await Geolocation.requestPermissions();
        return this.permissionStatus.location === 'granted';
      } else {
        // For web, we check if geolocation is available
        if (!navigator.geolocation) {
          console.error('Geolocation is not supported by this browser');
          return false;
        }
        
        // For web browsers, we need to request permission by attempting to get location
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            (error) => {
              console.error('Location permission denied:', error);
              resolve(false);
            },
            { timeout: 5000 }
          );
        });
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async checkPermissions(): Promise<boolean> {
    try {
      if (this.isNative) {
        this.permissionStatus = await Geolocation.checkPermissions();
        return this.permissionStatus.location === 'granted';
      } else {
        // For web, check if geolocation is available
        if (!navigator.geolocation) {
          return false;
        }
        
        // Check if we can query permissions (modern browsers)
        if ('permissions' in navigator) {
          try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            return permission.state === 'granted';
          } catch (error) {
            // Fallback: assume permission is available if geolocation exists
            return true;
          }
        }
        
        // Fallback for older browsers
        return true;
      }
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  }

  async getCurrentPosition(options?: LocationOptions): Promise<LocationResult | null> {
    try {
      if (this.isNative) {
        const hasPermission = await this.checkPermissions();
        if (!hasPermission) {
          const granted = await this.requestPermissions();
          if (!granted) {
            throw new Error('Location permission denied');
          }
        }

        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: options?.enableHighAccuracy ?? true,
          timeout: options?.timeout ?? 10000,
          maximumAge: options?.maximumAge ?? 0,
        });

        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
      } else {
        // Web implementation
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
              });
            },
            (error) => {
              console.error('Error getting current position:', error);
              reject(error);
            },
            {
              enableHighAccuracy: options?.enableHighAccuracy ?? true,
              timeout: options?.timeout ?? 10000,
              maximumAge: options?.maximumAge ?? 0,
            }
          );
        });
      }
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  }

  async watchPosition(
    callback: (position: LocationResult) => void,
    errorCallback?: (error: any) => void,
    options?: LocationOptions
  ): Promise<boolean> {
    try {
      if (this.isNative) {
        const hasPermission = await this.checkPermissions();
        if (!hasPermission) {
          const granted = await this.requestPermissions();
          if (!granted) {
            throw new Error('Location permission denied');
          }
        }

        this.watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy: options?.enableHighAccuracy ?? true,
            timeout: options?.timeout ?? 10000,
            maximumAge: options?.maximumAge ?? 1000,
          },
          (position, error) => {
            if (error) {
              console.error('Error watching position:', error);
              if (errorCallback) {
                errorCallback(error);
              }
              return;
            }
            
            if (position) {
              callback({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
              });
            }
          }
        );

        return true;
      } else {
        // Web implementation
        if (!navigator.geolocation) {
          const error = new Error('Geolocation is not supported by this browser');
          if (errorCallback) {
            errorCallback(error);
          }
          return false;
        }

        // First, try to get permission
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
          const error = new Error('Location permission denied');
          if (errorCallback) {
            errorCallback(error);
          }
          return false;
        }

        this.watchId = navigator.geolocation.watchPosition(
          (position) => {
            callback({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            });
          },
          (error) => {
            console.error('Error watching position:', error);
            if (errorCallback) {
              errorCallback(error);
            }
          },
          {
            enableHighAccuracy: options?.enableHighAccuracy ?? true,
            timeout: options?.timeout ?? 10000,
            maximumAge: options?.maximumAge ?? 1000,
          }
        );

        return true;
      }
    } catch (error) {
      console.error('Error starting watch position:', error);
      if (errorCallback) {
        errorCallback(error);
      }
      return false;
    }
  }

  async clearWatch(): Promise<void> {
    if (this.watchId) {
      if (this.isNative) {
        await Geolocation.clearWatch({ id: this.watchId as string });
      } else {
        navigator.geolocation.clearWatch(this.watchId as number);
      }
      this.watchId = null;
    }
  }

  getPermissionStatus(): PermissionStatus | null {
    return this.permissionStatus;
  }
}

export const locationService = new LocationService();