import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FestivalButton } from "@/components/ui/festival-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Crown, 
  Construction, 
  Ambulance, 
  Users,
  Cloud,
  Filter,
  Bell,
  BellOff
} from "lucide-react";
import { mockAlerts, Alert } from "@/services/mockData";
import { cn } from "@/lib/utils";

const alertTypes = [
  { id: 'all', label: 'All', icon: AlertTriangle },
  { id: 'vip', label: 'VIP', icon: Crown },
  { id: 'roadblock', label: 'Road', icon: Construction },
  { id: 'emergency', label: 'Emergency', icon: Ambulance },
  { id: 'crowd', label: 'Crowd', icon: Users },
  { id: 'weather', label: 'Weather', icon: Cloud },
];

export default function Alerts() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [mutedAlerts, setMutedAlerts] = useState<Set<string>>(new Set());

  const filteredAlerts = selectedType === 'all' 
    ? mockAlerts 
    : mockAlerts.filter(alert => alert.type === selectedType);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'vip': return Crown;
      case 'roadblock': return Construction;
      case 'emergency': return Ambulance;
      case 'crowd': return Users;
      case 'weather': return Cloud;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-muted text-muted-foreground border-muted';
      case 'medium': return 'bg-warning/20 text-warning-foreground border-warning/30';
      case 'high': return 'bg-destructive/20 text-destructive-foreground border-destructive/30';
      case 'critical': return 'bg-destructive text-destructive-foreground border-destructive';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const toggleMuteAlert = (alertId: string) => {
    const newMuted = new Set(mutedAlerts);
    if (newMuted.has(alertId)) {
      newMuted.delete(alertId);
    } else {
      newMuted.add(alertId);
    }
    setMutedAlerts(newMuted);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader title="Live Alerts" />

      {/* Alert Type Filters */}
      <div className="px-4 py-3 bg-gradient-card border-b border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by type</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {alertTypes.map(({ id, label, icon: Icon }) => (
            <FestivalButton
              key={id}
              variant={selectedType === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(id)}
              className="flex-shrink-0 gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
            </FestivalButton>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 p-4 space-y-4">
        {/* Active Alerts Count */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredAlerts.filter(a => a.active).length} Active Alerts
          </h3>
          <Badge className="bg-primary/10 text-primary">
            Live Updates
          </Badge>
        </div>

        {/* Alerts */}
        {filteredAlerts.length === 0 ? (
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                No alerts of this type are currently active.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              const isMuted = mutedAlerts.has(alert.id);
              
              return (
                <Card 
                  key={alert.id} 
                  className={cn(
                    "bg-gradient-card shadow-soft transition-all duration-200",
                    !alert.active && "opacity-60",
                    isMuted && "opacity-40"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        alert.severity === 'critical' ? "bg-destructive/20" : "bg-primary/10"
                      )}>
                        <AlertIcon className={cn(
                          "w-5 h-5",
                          alert.severity === 'critical' ? "text-destructive" : "text-primary"
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-foreground leading-tight">
                            {alert.title}
                          </h4>
                          <FestivalButton
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleMuteAlert(alert.id)}
                            className="w-8 h-8 flex-shrink-0"
                          >
                            {isMuted ? (
                              <BellOff className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </FestivalButton>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {alert.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={getAlertColor(alert.severity)}
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {alert.active && (
                              <Badge className="bg-success/20 text-success border-success/30">
                                ACTIVE
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {formatTime(alert.timestamp)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mt-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span className="text-xs text-muted-foreground">
                            {alert.area}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Emergency Banner */}
        <Card className="bg-gradient-sunset border-destructive/30 shadow-festival">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Ambulance className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Emergency Helpline</h4>
                <p className="text-white/90 text-sm">
                  Need immediate help? Call emergency services
                </p>
              </div>
              <FestivalButton
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                Call 108
              </FestivalButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}