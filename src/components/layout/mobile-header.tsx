import { useState } from "react";
import { FestivalButton } from "@/components/ui/festival-button";
import { Languages, HelpCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
  showSOS?: boolean;
  className?: string;
}

export function MobileHeader({ 
  title, 
  subtitle, 
  showLanguageToggle = true, 
  showSOS = true,
  className 
}: MobileHeaderProps) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 bg-gradient-card backdrop-blur-sm border-b border-border/50",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-3">
          {showLanguageToggle && (
            <FestivalButton
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-muted-foreground"
            >
              <Languages className="w-5 h-5" />
              <span className="sr-only">
                Switch to {language === 'en' ? 'Hindi' : 'English'}
              </span>
            </FestivalButton>
          )}
          
          {showSOS && (
            <FestivalButton
              variant="floating"
              size="floating"
              className="fixed bottom-20 right-4 z-50 shadow-lg"
            >
              <HelpCircle className="w-6 h-6" />
              <span className="sr-only">Emergency Help</span>
            </FestivalButton>
          )}
        </div>
      </div>
    </header>
  );
}