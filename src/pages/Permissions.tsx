import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bell, Users, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Permission {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  granted: boolean;
}

export default function Permissions() {
  console.log('Permissions component loading...');
  
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "location",
      icon: MapPin,
      title: "Location Access",
      description: "Required for navigation and finding nearby e-rickshaws",
      granted: false,
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      description: "Get alerts about traffic, ride updates, and offers",
      granted: false,
    },
    {
      id: "contacts",
      icon: Users,
      title: "Contacts",
      description: "Share your ride details with emergency contacts",
      granted: false,
    },
  ]);

  const navigate = useNavigate();
  const [showSuccessInterface, setShowSuccessInterface] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate if all permissions are granted
  const allPermissionsGranted = permissions.every(p => p.granted);

  const handlePermissionRequest = (permissionId: string) => {
    // Simulate permission request
    setPermissions(prev =>
      prev.map(p =>
        p.id === permissionId ? { ...p, granted: true } : p
      )
    );
  };

  useEffect(() => {
    if (allPermissionsGranted && !showSuccessInterface) {
      setIsAnimating(true);
      setTimeout(() => {
        // Navigate to success page instead of showing inline interface
        const searchParams = new URLSearchParams(location.search);
        const role = searchParams.get("role") || "user";
        navigate(`/success?role=${role}`);
      }, 800);
    }
  }, [allPermissionsGranted, showSuccessInterface, navigate]);

  const handleContinue = () => {
    // Get role from URL params
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get("role") || "user";
    
    if (role === "contributor") {
      navigate("/contributor-dashboard");
    } else {
      navigate("/map");
    }
  };

  const handleGrantAll = () => {
    setPermissions(prev => prev.map(p => ({ ...p, granted: true })));
  };


  console.log('Rendering main permissions interface, allPermissionsGranted:', allPermissionsGranted);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-8">
      <div className={`w-full max-w-md space-y-8 transition-all duration-800 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            {allPermissionsGranted && (
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-orange-300 rounded-full animate-ping"></div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-orange-600">Simhastha e-Move</h1>
          <p className="text-gray-600 mt-2">Allow permissions to get started</p>
        </div>

        {/* Permissions List */}
        <div className="space-y-4">
          {permissions.map((permission, index) => {
            const IconComponent = permission.icon;
            return (
              <Card 
                key={permission.id} 
                className={`overflow-hidden border-2 transition-all duration-500 ${
                  permission.granted 
                    ? 'border-orange-300 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full transition-all duration-300 ${
                      permission.granted 
                        ? "bg-orange-500 text-white shadow-lg" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {permission.granted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-gray-900">
                        {permission.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {permission.description}
                      </p>
                      
                      {!permission.granted && (
                        <Button
                          size="sm"
                          onClick={() => handlePermissionRequest(permission.id)}
                          className="mt-2 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
                        >
                          Allow
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-8 space-y-4">
          {!allPermissionsGranted && (
            <Button
              onClick={handleGrantAll}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 py-6 text-lg font-semibold"
              size="lg"
            >
              Grant All Permissions
            </Button>
          )}
          
          <Button
            onClick={handleContinue}
            variant={allPermissionsGranted ? "default" : "outline"}
            className={`w-full transition-all duration-300 py-6 text-lg font-semibold ${
              allPermissionsGranted 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'border-orange-300 text-orange-600 hover:bg-orange-50'
            }`}
            disabled={!allPermissionsGranted}
            size="lg"
          >
            {allPermissionsGranted ? "Continue to App" : "Skip for Now"}
          </Button>
          
          {!allPermissionsGranted && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Some features may be limited without permissions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}