import { useState } from "react";
import { Users, Car, MapPin, AlertTriangle, TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  // Dummy data
  const stats = {
    totalUsers: 1247,
    activeRickshaws: 89,
    parkingSpots: 156,
    activeAlerts: 12
  };

  const users = [
    { id: 1, name: "Rajesh Kumar", phone: "+91 9876543210", rides: 23, status: "Active" },
    { id: 2, name: "Priya Sharma", phone: "+91 9876543211", rides: 45, status: "Active" },
    { id: 3, name: "Amit Patel", phone: "+91 9876543212", rides: 12, status: "Inactive" },
    { id: 4, name: "Sunita Verma", phone: "+91 9876543213", rides: 67, status: "Active" },
  ];

  const rickshaws = [
    { id: 1, driver: "Mohan Singh", vehicle: "UP32AB1234", location: "Railway Station", status: "Available" },
    { id: 2, driver: "Ravi Kumar", vehicle: "UP32CD5678", location: "Bus Stand", status: "Busy" },
    { id: 3, driver: "Suresh Yadav", vehicle: "UP32EF9012", location: "Ramghat", status: "Available" },
    { id: 4, driver: "Deepak Jain", vehicle: "UP32GH3456", location: "Market Area", status: "Offline" },
  ];

  const parkingSpots = [
    { id: 1, name: "Railway Station Parking", capacity: 50, occupied: 35, revenue: "₹2,450" },
    { id: 2, name: "Bus Stand Parking", capacity: 30, occupied: 28, revenue: "₹1,680" },
    { id: 3, name: "Ramghat Parking", capacity: 40, occupied: 15, revenue: "₹900" },
    { id: 4, name: "Market Parking", capacity: 25, occupied: 22, revenue: "₹1,320" },
  ];

  const alerts = [
    { id: 1, type: "Traffic Jam", location: "Main Road", severity: "High", time: "10 mins ago" },
    { id: 2, type: "Road Block", location: "Bridge Area", severity: "Medium", time: "25 mins ago" },
    { id: 3, type: "Accident", location: "Bus Stand", severity: "High", time: "45 mins ago" },
    { id: 4, type: "Construction", location: "Market", severity: "Low", time: "2 hours ago" },
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
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active E-Rickshaws</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRickshaws}</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parking Spots</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.parkingSpots}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">-3% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different data views */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="rickshaws">E-Rickshaws</TabsTrigger>
            <TabsTrigger value="parking">Parking</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                        <p className="text-sm">Total Rides: {user.rides}</p>
                      </div>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rickshaws">
            <Card>
              <CardHeader>
                <CardTitle>E-Rickshaw Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rickshaws.map((rickshaw) => (
                    <div key={rickshaw.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{rickshaw.driver}</h3>
                        <p className="text-sm text-muted-foreground">{rickshaw.vehicle}</p>
                        <p className="text-sm">Location: {rickshaw.location}</p>
                      </div>
                      <Badge 
                        variant={
                          rickshaw.status === "Available" ? "default" : 
                          rickshaw.status === "Busy" ? "secondary" : "destructive"
                        }
                      >
                        {rickshaw.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parking">
            <Card>
              <CardHeader>
                <CardTitle>Parking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parkingSpots.map((spot) => (
                    <div key={spot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{spot.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Occupied: {spot.occupied}/{spot.capacity}
                        </p>
                        <p className="text-sm">Revenue: {spot.revenue}</p>
                      </div>
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alert Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{alert.type}</h3>
                        <p className="text-sm text-muted-foreground">{alert.location}</p>
                        <p className="text-sm">{alert.time}</p>
                      </div>
                      <Badge 
                        variant={
                          alert.severity === "High" ? "destructive" : 
                          alert.severity === "Medium" ? "secondary" : "outline"
                        }
                      >
                        {alert.severity}
                      </Badge>
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