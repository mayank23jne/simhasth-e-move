import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c9b69ffd9fc345629deb978aaf7db59c',
  appName: 'ujjain-saathi',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: {
        location: 'always'
      }
    }
  },
  android: {
    buildOptions: {
      // Add any specific Android build options here if needed
      // For example, to ensure API key is correctly picked up by Gradle
    }
  }
};

export default config;
