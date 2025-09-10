import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Navigation, AlertTriangle, ParkingCircle, Settings } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/success" },
  { icon: Navigation, label: "Plan", path: "/plan" },
  { icon: AlertTriangle, label: "Alerts", path: "/alerts" },
  { icon: ParkingCircle, label: "Parking", path: "/parking" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="grid grid-cols-5 px-2 py-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/success"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200",
                "min-h-[60px] text-xs font-medium",
                isActive
                  ? "text-primary bg-primary/10 shadow-festival"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] leading-tight">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}