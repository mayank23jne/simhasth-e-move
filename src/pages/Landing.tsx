import { useNavigate } from "react-router-dom";
import { Car, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRoleSelection = (role: string) => {
    if (role === "user") {
      navigate("/login?role=user");
    } else if (role === "contributor") {
      navigate("/login?role=contributor");
    } else if (role === "admin") {
      navigate("/admin-login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-6">
          {/* Hackathon Image */}
          <img 
            src="/icons/Hackathon.png" 
            alt="Hackathon Logo" 
            className="mx-auto h-32 w-32 mb-2 object-contain"
          />
          
          <img src="/icons/logo.png" alt="Simhastha e-move Logo" className="mx-auto h-24 w-auto mb-6" />

          <div className="flex items-center justify-center space-x-3 mb-2">
            {/* <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Car className="w-7 h-7 text-primary-foreground" />
            </div> */}
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          </div>
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* User Login Card */}
          <Card className="p-3 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 hover:scale-105 h-50">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{t("userLogin")}</h3>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed line-clamp-3">
              {t("userLoginDesc")}
            </p>
            <Button 
              onClick={() => handleRoleSelection("user")}
              className="w-full"
              size="sm"
            >
              {t("getStarted")}
            </Button>
          </Card>

          {/* Add E-Rickshaw/Parking Card */}
          <Card className="p-3 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 hover:scale-105 h-50">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{t("addVehicle")}</h3>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed line-clamp-3">
              {t("addVehicleDesc")}
            </p>
            <Button 
              onClick={() => handleRoleSelection("contributor")}
              className="w-full"
              size="sm"
            >
              {t("getStarted")}
            </Button>
          </Card>

          {/* Admin Panel Card */}
          <Card className="p-3 text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 hover:scale-105 h-50">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{t("adminPanel")}</h3>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed line-clamp-3">
              {t("adminPanelDesc")}
            </p>
            <Button 
              onClick={() => handleRoleSelection("admin")}
                className="w-full"
              size="sm"
            >
              {t("getStarted")}
            </Button>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-5 text-muted-foreground">
          <p className="text-sm">{t("copyright")}</p>
        </footer>
      </div>
    </div>
  );
}