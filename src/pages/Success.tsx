import { useNavigate } from "react-router-dom";
import { Navigation, ParkingCircle, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LocationService } from "@/lib/locationService";
import { MobileNav } from "@/components/ui/mobile-nav";

export default function Success() {
  const navigate = useNavigate();
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  
  const locationService = new LocationService();

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

  const handleFindRoute = () => {
    navigate("/plan");
  };

  const handleParkingInfo = () => {
    navigate("/parking");
  };

  const handleERickshaw = async () => {
    setIsRequestingLocation(true);
    
    try {
      // First check if we already have permission
      const hasPermission = await locationService.checkPermissions();
      
      if (hasPermission) {
        // Permission already granted, navigate to map
        navigate("/map");
      } else {
        // Request permission directly (this will show browser's native permission dialog)
        const granted = await locationService.requestPermissions();
        
        if (granted) {
          navigate("/map");
        } else {
          // Permission denied, but still navigate to map (map component will handle this)
          navigate("/map");
        }
      }
    } catch (error) {
      console.error('Error with location permissions:', error);
      // On error, still navigate to map
    navigate("/map");
    } finally {
      setIsRequestingLocation(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 mb-20">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo and Title */}
        <div className="space-y-2 animate-fade-in">
          {/* Hackathon Image */}
          <img 
            src="/icons/Hackathon.png" 
            alt="Hackathon Logo" 
            className="mx-auto h-32 w-32 object-contain"
          />
          
          <div className="relative">
            <img 
              src="/icons/logo.png" 
              alt="Simhastha e-move Logo" 
              className="mx-auto h-24 w-24 object-contain"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-orange-600">Simhastha e-Move</h1>
            <p className="text-orange-500/90 text-lg">Seamless Transportation at Your Fingertips</p>
          </div>
        </div>

        {/* Feature Buttons */}
        <div className="space-y-4 mt-12">
          <Button 
            onClick={handleFindRoute}
            className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-600 border border-orange-300 backdrop-blur-sm py-6 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            size="lg"
          >
            <Navigation className="w-6 h-6 mr-3" />
            Find Route
          </Button>
          
          <Button 
            onClick={handleParkingInfo}
            className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-600 border border-orange-300 backdrop-blur-sm py-6 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            size="lg"
          >
            <ParkingCircle className="w-6 h-6 mr-3" />
            Parking Info
          </Button>
          
          <Button 
            onClick={handleERickshaw}
            disabled={isRequestingLocation}
            className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-600 border border-orange-300 backdrop-blur-sm py-6 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isRequestingLocation ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-3"></div>
                Requesting Permission...
              </>
            ) : (
              <>
            <Car className="w-6 h-6 mr-3" />
            E-Rickshaw Live
              </>
            )}
          </Button>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2 justify-center mt-8">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
      </main>

      {/* Use existing MobileNav */}
      <MobileNav />
    </div>
  );
}
