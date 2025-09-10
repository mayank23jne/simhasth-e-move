import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FestivalButton } from "@/components/ui/festival-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Languages,
  Download,
  Bell,
  MapPin,
  Wifi,
  WifiOff,
  Settings as SettingsIcon,
  User,
  Shield,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  // const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [downloadedMaps, setDownloadedMaps] = useState(false);

  const handleDownloadMaps = () => {
    setDownloadedMaps(true);
    // Simulate download process
    setTimeout(() => {
      // Download complete
    }, 2000);
  };

  const settingSections = [
    {
      title: t("appPreferences"),
      items: [
        {
          icon: Languages,
          label: t("language"),
          value: language === 'en' ? 'English' : 'हिन्दी',
          action: () => {},
          type: 'select' as const
        },
        // {
        //   icon: darkMode ? Moon : Sun,
        //   label: "Dark Mode",
        //   value: darkMode,
        //   action: setDarkMode,
        //   type: 'switch' as const
        // },
        {
          icon: Bell,
          label: t("pushNotifications"),
          value: notifications,
          action: setNotifications,
          type: 'switch' as const
        }
      ]
    },
    {
      title: t("offlineFeatures"),
      items: [
        {
          icon: downloadedMaps ? MapPin : Download,
          label: t("downloadOfflineMaps"),
          value: downloadedMaps ? t("downloaded") : t("download"),
          action: handleDownloadMaps,
          type: 'button' as const,
          disabled: downloadedMaps
        },
        {
          icon: offlineMode ? WifiOff : Wifi,
          label: t("offlineMode"),
          value: offlineMode,
          action: setOfflineMode,
          type: 'switch' as const
        }
      ]
    },
    {
      title: t("accountAndSupport"),
      items: [
        {
          icon: User,
          label: t("profileSettings"),
          value: t("manage"),
          action: () => {},
          type: 'button' as const
        },
        {
          icon: Shield,
          label: t("privacyAndSecurity"),
          value: t("configure"),
          action: () => {},
          type: 'button' as const
        },
        {
          icon: HelpCircle,
          label: t("helpAndSupport"),
          value: t("getHelp"),
          action: () => {},
          type: 'button' as const
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader title={t("settings")} />

      <div className="flex-1 p-4 space-y-6">
        {/* App Status */}
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{t("simhasthaEMove")}</h3>
                  <p className="text-sm text-muted-foreground">{t("version")} 1.0.0</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                <Badge className="bg-success/20 text-success">{t("online")}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <Card key={section.title} className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      {item.type === 'button' && typeof item.value === 'string' && (
                        <div className="text-xs text-muted-foreground">{item.value}</div>
                      )}
                      {item.type === 'select' && (
                        <div className="text-xs text-muted-foreground">
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.type === 'switch' ? (
                    <Switch
                      checked={item.value as boolean}
                      onCheckedChange={item.action as (checked: boolean) => void}
                    />
                  ) : item.type === 'select' ? (
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32 bg-card/95 backdrop-blur-sm border border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        <SelectItem value="hi">हिंदी</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <FestivalButton
                      variant="outline"
                      size="sm"
                      onClick={item.action as () => void}
                      disabled={item.disabled}
                      className={cn(
                        item.disabled && "opacity-50"
                      )}
                    >
                      {typeof item.value === 'string' ? item.value : t("configure")}
                    </FestivalButton>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Offline Maps Status */}
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">{t("offlineMapsStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{t("ujjainTempleArea")}</span>
                </div>
                <Badge className={downloadedMaps ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}>
                  {downloadedMaps ? t("downloaded") : t("notDownloaded")}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{t("railwayStationRoute")}</span>
                </div>
                <Badge className="bg-muted text-muted-foreground">
                  {t("notDownloaded")}
                </Badge>
              </div>

              {!downloadedMaps && (
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 mt-3">
                  <div className="flex items-center gap-2 text-warning">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">{t("downloadRecommended")}</span>
                  </div>
                  <p className="text-xs text-warning-foreground mt-1">
                    {t("downloadMapsRecommendation")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-gradient-sunset border-primary/30 shadow-festival">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">{t("needHelp")}</h4>
                <p className="text-white/90 text-sm">
                  {t("supportAvailable")}
                </p>
              </div>
              <FestivalButton
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {t("contact")}
              </FestivalButton>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>{t("appMotto")}</p>
          <p>{t("copyrightSettings")}</p>
        </div>
      </div>
    </div>
  );
}