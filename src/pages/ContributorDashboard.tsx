import { useState } from "react";
import { Car, MapPin, Plus, Edit, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function ContributorDashboard() {
  const navigate = useNavigate();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddParking, setShowAddParking] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  // Dummy data for contributor's vehicles and parking spots
  const myRickshaws = [
    { id: 1, vehicle: "UP32AB1234", status: "Active", earnings: "₹2,450", rides: 23 },
    { id: 2, vehicle: "UP32CD5678", status: "Maintenance", earnings: "₹1,890", rides: 18 },
  ];

  const myParkingSpots = [
    { id: 1, name: "My Parking Spot 1", location: "Near Railway Station", capacity: 20, occupied: 15, revenue: "₹1,200" },
    { id: 2, name: "My Parking Spot 2", location: "Market Area", capacity: 15, occupied: 12, revenue: "₹900" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Contributor Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My E-Rickshaws</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myRickshaws.length}</div>
              <p className="text-xs text-muted-foreground">Active vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parking Spots</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myParkingSpots.length}</div>
              <p className="text-xs text-muted-foreground">Registered spots</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹6,540</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for managing vehicles and parking */}
        <Tabs defaultValue="rickshaws" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rickshaws">My E-Rickshaws</TabsTrigger>
            <TabsTrigger value="parking">My Parking Spots</TabsTrigger>
          </TabsList>

          <TabsContent value="rickshaws">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">E-Rickshaw Management</CardTitle>
                <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-3 h-3 mr-1" />
                      Add E-Rickshaw
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New E-Rickshaw</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vehicle-number">Vehicle Number</Label>
                        <Input id="vehicle-number" placeholder="UP32XY1234" />
                      </div>
                      <div>
                        <Label htmlFor="driver-name">Driver Name</Label>
                        <Input id="driver-name" placeholder="Enter driver name" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+91 9876543210" />
                      </div>
                      <Button className="w-full" onClick={() => setShowAddVehicle(false)}>
                        Add E-Rickshaw
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myRickshaws.map((rickshaw) => (
                    <div key={rickshaw.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{rickshaw.vehicle}</h3>
                        <p className="text-sm text-muted-foreground">Rides: {rickshaw.rides}</p>
                        <p className="text-sm">Earnings: {rickshaw.earnings}</p>
                      </div>
                      <div className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
                        <Badge variant={rickshaw.status === "Active" ? "default" : "secondary"}>
                          {rickshaw.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parking">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle  className="text-sm font-medium">Parking Spot Management</CardTitle>
                <Dialog open={showAddParking} onOpenChange={setShowAddParking}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Parking Spot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Parking Spot</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="spot-name">Spot Name</Label>
                        <Input id="spot-name" placeholder="Enter parking spot name" />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="Enter location" />
                      </div>
                      <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" type="number" placeholder="Number of parking spaces" />
                      </div>
                      <div>
                        <Label htmlFor="rate">Hourly Rate (₹)</Label>
                        <Input id="rate" type="number" placeholder="Rate per hour" />
                      </div>
                      <Button className="w-full" onClick={() => setShowAddParking(false)}>
                        Add Parking Spot
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myParkingSpots.map((spot) => (
                    <div key={spot.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{spot.name}</h3>
                        <p className="text-sm text-muted-foreground">{spot.location}</p>
                        <p className="text-sm">Occupied: {spot.occupied}/{spot.capacity}</p>
                        <p className="text-sm">Revenue: {spot.revenue}</p>
                      </div>
                      <div className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {Math.round((spot.occupied / spot.capacity) * 100)}% Full
                          </div>
                          <div className="w-20 h-2 bg-muted rounded-full mt-1">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(spot.occupied / spot.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}