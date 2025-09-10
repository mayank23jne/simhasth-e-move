import { NavLink, useNavigate } from "react-router-dom";
import { X, Home, Navigation, MapPin, Gift, HelpCircle, Settings, LogOut, User, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Home", path: "/map" },
  { icon: Navigation, label: "Route Planner", path: "/plan" },
  { icon: MapPin, label: "Live Tracker", path: "/route-tracker" },
  { icon: Trash, label: "Garbage Tracker", path: "/garbage-tracker" }, // Added Garbage Tracker
  // { icon: Gift, label: "Offers", path: "/offers" },
  { icon: HelpCircle, label: "Support/Help", path: "/support" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real application, you would clear authentication tokens here.
    onClose();
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-60 bg-card border-r border-border z-[9999] transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">Devotee Name</h3>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
            
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-6 py-3 text-foreground hover:bg-muted transition-colors",
                    isActive && "bg-primary/10 text-primary border-r-2 border-primary"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-red-600 px-6 py-3 w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </nav>

         
        </div>
      </div>
    </>
  );
}