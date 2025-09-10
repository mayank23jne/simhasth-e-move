import { AppHeader } from "@/components/layout/AppHeader";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { mockGarbageVehicles } from "@/services/mockData";
import { MapPin } from "lucide-react";

export default function GarbageTracker() {
  const ujjainLatitude = 23.1795;
  const ujjainLongitude = 75.7885;

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader title="Garbage Tracker" />
      <div className="flex-1 relative overflow-hidden">
        <InteractiveMap
          latitude={ujjainLatitude}
          longitude={ujjainLongitude}
          className="w-full h-full"
          garbageVehicles={mockGarbageVehicles}
          location="Ujjain - Garbage Tracking"
        />
      </div>
      <div className="p-4 text-center text-sm text-muted-foreground">
        <MapPin className="inline-block w-4 h-4 mr-1" /> Live tracking of garbage vehicles in Ujjain
      </div>
    </div>
  );
}
