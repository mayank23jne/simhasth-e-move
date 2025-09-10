import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FestivalButton } from "@/components/ui/festival-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Zap,
  Home,
  Route,
  Wallet,
  User,
  ArrowRight,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MapComponent } from "@/components/map/MapComponent";
import { mockERickshaws, mockGarbageVehicles, mockParkingLots, mockAlerts } from "@/services/mockData";

const UJJAIN_CENTER: [number, number] = [23.1795, 75.7885]; // Default Ujjain coordinates, same as MapView

const RouteTracker = () => {
  const [fromLocation, setFromLocation] = useState("Railway Station");
  const [toLocation, setToLocation] = useState("Ramghat");
  const [showRoute, setShowRoute] = useState(true);
  // Removed rickshawPositions state and its useEffect as MapComponent will handle e-rickshaws

  const handlePlanRoute = () => {
    setShowRoute(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader title="Route Tracker" />

      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="From location"
              className="pl-10 bg-background"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="To location"
              className="pl-10 bg-background"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
            </div>
          </div>

          <FestivalButton 
            onClick={handlePlanRoute}
            className="w-full"
            size="sm"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Plan Route
          </FestivalButton>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent
          center={UJJAIN_CENTER}
          zoom={13} // You can adjust the zoom level as needed
          className="w-full h-full rounded-lg"
          activeFilter="none" // Display only live location and map
          eRickshaws={mockERickshaws}
          parkingLots={mockParkingLots}
          alerts={mockAlerts}
        />

        {/* Route Options Floating Card */}
        {showRoute && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="font-medium">Walking</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>18 min</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Less Crowded</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span className="font-medium">E-Rickshaw</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>8 min</span>
                  </div>
                  <Badge className="bg-success text-success-foreground text-xs">₹45</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Live Rickshaws Info */}
        <div className="absolute top-20 right-4 z-10">
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border">
            <div className="p-3 text-center">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Live Rickshaws</span>
              </div>
              <div className="text-lg font-bold text-success">{mockERickshaws.length}</div>
              <div className="text-xs text-muted-foreground">Available Now</div>
            </div>
          </Card>
        </div>
      </div>

      {/* ETA Banner */}
      {showRoute && (
        <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold">ETA: 8 minutes</div>
                <div className="text-sm opacity-90">via E-Rickshaw</div>
              </div>
            </div>
            <FestivalButton variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              Start Navigation
              <ArrowRight className="w-4 h-4 ml-1" />
            </FestivalButton>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="bg-white dark:bg-slate-800 border-t p-2 shadow-lg">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-primary">
            <Route className="w-5 h-5" />
            <span className="text-xs">Route</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <Zap className="w-5 h-5" />
            <span className="text-xs">Live</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Wallet</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteTracker;