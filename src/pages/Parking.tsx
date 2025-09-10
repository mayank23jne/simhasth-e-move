import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FestivalButton } from "@/components/ui/festival-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ParkingCircle, 
  MapPin, 
  Navigation, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle
} from "lucide-react";
import { mockParkingLots, ParkingLot, mockERickshaws, mockAlerts } from "@/services/mockData";
import { GoogleMapComponent } from "@/components/map/GoogleMapComponent";
import { cn } from "@/lib/utils";

export default function Parking() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [originalUserLocation, setOriginalUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedParkingLot, setSelectedParkingLot] = useState<ParkingLot | null>(null);

  // Get user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setOriginalUserLocation(location); // Store original location
        },
        (error) => {
          console.log('Location access denied or unavailable:', error);
          // Fallback to Delhi coordinates
          const fallbackLocation = { lat: 28.6139, lng: 77.2090 };
          setUserLocation(fallbackLocation);
          setOriginalUserLocation(fallbackLocation);
        }
      );
    } else {
      // Fallback to Delhi coordinates
      const fallbackLocation = { lat: 28.6139, lng: 77.2090 };
      setUserLocation(fallbackLocation);
      setOriginalUserLocation(fallbackLocation);
    }
  }, []);

  const getOccupancyPercentage = (lot: ParkingLot) => {
    return Math.round((lot.occupied / lot.capacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 75) return "text-warning";
    return "text-success";
  };

  const getTrendIcon = (trend: ParkingLot['trend']) => {
    switch (trend) {
      case 'filling': return TrendingUp;
      case 'emptying': return TrendingDown;
      case 'stable': return Minus;
    }
  };

  const getTrendColor = (trend: ParkingLot['trend']) => {
    switch (trend) {
      case 'filling': return "text-destructive";
      case 'emptying': return "text-success";
      case 'stable': return "text-muted-foreground";
    }
  };

  const sortedLots = [...mockParkingLots].sort((a, b) => {
    // Prioritize lots with more available spaces
    return b.available - a.available;
  });

  // Handle navigation to parking lot
  const handleNavigate = (lot: ParkingLot) => {
    // Set the selected parking lot to center map on its coordinates
    setSelectedParkingLot(lot);
    
    // Update user location to the selected parking lot location
    // This simulates "moving" the user to that location
    setUserLocation({
      lat: lot.lat,
      lng: lot.lng
    });
    
    // Switch to map view
    setViewMode('map');
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'list' | 'map') => {
    setViewMode(mode);
    // Clear selected parking lot and reset user location when switching views
    if (mode === 'list') {
      setSelectedParkingLot(null);
      // Reset user location to original when going back to list
      if (originalUserLocation) {
        setUserLocation(originalUserLocation);
      }
    } else if (mode === 'map') {
      // Only clear if we're switching to general map view (not from navigate)
      // This will be handled by the "Map View" button click
      setSelectedParkingLot(null);
      // Reset user location to original when switching to general map view
      if (originalUserLocation) {
        setUserLocation(originalUserLocation);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader title="Smart Parking" />

      {/* View Toggle */}
      <div className="px-4 py-3 bg-gradient-card border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <FestivalButton
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
            >
              List View
            </FestivalButton>
            <FestivalButton
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('map')}
            >
              Map View
            </FestivalButton>
          </div>
          
          <Badge className="bg-primary/10 text-primary">
            {sortedLots.reduce((sum, lot) => sum + lot.available, 0)} spots available
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Summary Stats */}
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {sortedLots.filter(lot => lot.available > 50).length}
                </div>
                <div className="text-xs text-muted-foreground">Lots Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {sortedLots.filter(lot => lot.available <= 50 && lot.available > 10).length}
                </div>
                <div className="text-xs text-muted-foreground">Filling Up</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {sortedLots.filter(lot => lot.available <= 10).length}
                </div>
                <div className="text-xs text-muted-foreground">Nearly Full</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parking Lots List */}
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {sortedLots.map((lot) => {
              const occupancyPercentage = getOccupancyPercentage(lot);
              const TrendIcon = getTrendIcon(lot.trend);
              
              return (
                <Card 
                  key={lot.id}
                  className={cn(
                    "bg-gradient-card shadow-soft transition-all duration-200 hover:shadow-festival",
                    lot.available <= 10 && "border-destructive/30"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          lot.available <= 10 
                            ? "bg-destructive/20" 
                            : lot.available <= 50
                            ? "bg-warning/20"
                            : "bg-success/20"
                        )}>
                          <ParkingCircle className={cn(
                            "w-5 h-5",
                            lot.available <= 10 
                              ? "text-destructive" 
                              : lot.available <= 50
                              ? "text-warning"
                              : "text-success"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">{lot.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{lot.distance} km away</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={cn(
                          "text-lg font-bold",
                          getOccupancyColor(occupancyPercentage)
                        )}>
                          {lot.available}
                        </div>
                        <div className="text-xs text-muted-foreground">available</div>
                      </div>
                    </div>

                    {/* Occupancy Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {lot.occupied}/{lot.capacity} occupied
                        </span>
                        <span className={getOccupancyColor(occupancyPercentage)}>
                          {occupancyPercentage}%
                        </span>
                      </div>
                      <Progress 
                        value={occupancyPercentage} 
                        className="h-2"
                      />
                    </div>

                    {/* Trend and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendIcon className={cn("w-4 h-4", getTrendColor(lot.trend))} />
                        <span className={cn("text-sm capitalize", getTrendColor(lot.trend))}>
                          {lot.trend}
                        </span>
                        
                        {lot.available <= 10 && (
                          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Almost Full
                          </Badge>
                        )}
                      </div>
                      
                      <FestivalButton
                        variant={lot.available > 10 ? "default" : "outline"}
                        size="sm"
                        disabled={lot.available === 0}
                        onClick={() => handleNavigate(lot)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </FestivalButton>
                    </div>

                    {/* Estimated time */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>~{Math.round(lot.distance * 3)} min walk</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Map View */
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {selectedParkingLot ? `${selectedParkingLot.name} - Parking Map` : 'Parking Map'}
              </CardTitle>
              {selectedParkingLot && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="w-4 h-4" />
                  <span>Your location: {selectedParkingLot.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {selectedParkingLot.available} spots available
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 rounded-lg overflow-hidden">
                {userLocation ? (
                  <GoogleMapComponent
                    key={selectedParkingLot ? `custom-${selectedParkingLot.id}` : 'normal'}
                    center={selectedParkingLot ? { lat: selectedParkingLot.lat, lng: selectedParkingLot.lng } : userLocation}
                    zoom={selectedParkingLot ? 16 : 14}
                    className="w-full h-full"
                    activeFilter="parking"
                    eRickshaws={[]}
                    parkingLots={mockParkingLots}
                    alerts={[]}
                    useCustomUserLocation={selectedParkingLot ? true : false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
                      <p className="text-sm text-muted-foreground">Loading map...</p>
                    </div>
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Action */}
        <Card className="bg-gradient-sunset border-primary/30 shadow-festival">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Smart Suggestion</h4>
                <p className="text-white/90 text-sm">
                  Railway Station Parking has the most spaces available
                </p>
              </div>
              <FestivalButton
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                Go There
              </FestivalButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}