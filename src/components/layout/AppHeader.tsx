import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./AppSidebar";
import { useLanguage } from "@/contexts/LanguageContext";

interface AppHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function AppHeader({ title, onMenuClick }: AppHeaderProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const { t } = useLanguage();

  const handleMenuClick = () => {
    setShowSidebar(true);
    onMenuClick?.();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMenuClick}
            className="text-foreground hover:bg-transparent hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <h1 className="text-lg font-bold text-primary">{title || t("simhasthaEMove")}</h1>

          <Button
            variant="ghost"
            size="icon"
            className="text-foreground relative hover:bg-transparent hover:text-foreground"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-[8px] text-destructive-foreground font-medium">3</span>
            </span>
          </Button>
        </div>
      </header>

      <AppSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
}