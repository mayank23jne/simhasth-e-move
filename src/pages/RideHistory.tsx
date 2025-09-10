import { useState } from "react";
import { Star, MapPin, Clock, Car } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Ride {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  fare: number;
  driverName: string;
  rating: number;
  status: "completed" | "cancelled";
  vehicleType: "e-rickshaw" | "auto";
}

export default function RideHistory() {
  const [rides] = useState<Ride[]>([
    {
      id: "1",
      date: "Today",
      time: "2:30 PM",
      from: "Railway Station",
      to: "Ramghat",
      duration: "12 mins",
      distance: "3.2 km",
      fare: 50,
      driverName: "Ramesh Kumar",
      rating: 5,
      status: "completed",
      vehicleType: "e-rickshaw"
    },
    {
      id: "2",
      date: "Yesterday",
      time: "11:45 AM",
      from: "Mahakal Temple",
      to: "Bus Stand",
      duration: "8 mins",
      distance: "2.1 km",
      fare: 35,
      driverName: "Suresh Sharma",
      rating: 4,
      status: "completed",
      vehicleType: "e-rickshaw"
    },
    {
      id: "3",
      date: "2 days ago",
      time: "6:15 PM",
      from: "Hotel Avanti",
      to: "Kal Bhairav",
      duration: "15 mins",
      distance: "4.5 km",
      fare: 65,
      driverName: "Prakash Patel",
      rating: 5,
      status: "completed",
      vehicleType: "auto"
    },
    {
      id: "4",
      date: "3 days ago",
      time: "9:30 AM",
      from: "Bus Stand",
      to: "Triveni Ghat",
      duration: "0 mins",
      distance: "0 km",
      fare: 0,
      driverName: "Cancelled",
      rating: 0,
      status: "cancelled",
      vehicleType: "e-rickshaw"
    }
  ]);

  const handleRateRide = (rideId: string) => {
    // Handle rating logic
    console.log("Rate ride:", rideId);
  };

  const handleBookAgain = (ride: Ride) => {
    // Handle booking again logic
    console.log("Book again:", ride);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Ride History" />
      
      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{rides.filter(r => r.status === "completed").length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">₹{rides.filter(r => r.status === "completed").reduce((sum, r) => sum + r.fare, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">4.7</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Ride List */}
        {rides.map((ride) => (
          <Card key={ride.id} className={ride.status === "cancelled" ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{ride.date}</span>
                      <span className="text-sm text-muted-foreground">{ride.time}</span>
                    </div>
                    <Badge variant={ride.status === "completed" ? "default" : "destructive"} className="text-xs">
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                {ride.status === "completed" && (
                  <div className="text-lg font-semibold text-primary">₹{ride.fare}</div>
                )}
              </div>

              {/* Route */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium">{ride.from}</span>
                </div>
                <div className="flex items-center space-x-2 ml-1">
                  <div className="w-px h-4 bg-border ml-1"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <span className="text-sm font-medium">{ride.to}</span>
                </div>
              </div>

              {ride.status === "completed" && (
                <>
                  {/* Trip Details */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{ride.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{ride.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="w-4 h-4" />
                      <span className="capitalize">{ride.vehicleType.replace("-", " ")}</span>
                    </div>
                  </div>

                  {/* Driver & Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{ride.driverName}</div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= ride.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBookAgain(ride)}
                      >
                        Book Again
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {ride.status === "cancelled" && (
                <div className="text-sm text-muted-foreground">
                  Ride was cancelled. No charges applied.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}