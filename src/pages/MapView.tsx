import { AppHeader } from "@/components/layout/AppHeader";
import { mockERickshaws } from "@/services/mockData";
import { GoogleMapComponent } from "@/components/map/GoogleMapComponent";

type MapFilter = 'all' | 'rickshaws';

const UJJAIN_CENTER: [number, number] = [23.1795, 75.7885]; // Default Ujjain coordinates

export default function MapView() {
  const activeFilter = 'rickshaws'; // Always show e-rickshaws

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader title="Live Map" />

      <div className="flex-1 relative overflow-hidden mb-20">
        <GoogleMapComponent
          center={{ lat: UJJAIN_CENTER[0], lng: UJJAIN_CENTER[1] }}
          zoom={13}
          className="w-full h-full rounded-lg"
          activeFilter={activeFilter}
          eRickshaws={mockERickshaws}
          parkingLots={[]}
          alerts={[]}
        />


        {/* Existing Navigation Button and Directions (if needed, adjust z-index) */}
        {/* Note: Original code had these, re-add if necessary with proper z-index */} 

        {/* Live Stats Card (remove or integrate differently if redundant with counter panel) */}
        {/* <Card className="absolute top-4 left-4 right-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border border-border/50 z-20">
          <div className="p-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-primary">
                  {mockERickshaws.filter(r => r.status === 'available').length}
                </div>
                <div className="text-xs text-muted-foreground">E-Rickshaws</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">
                  {mockParkingLots.reduce((sum, lot) => sum + lot.available, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Parking</div>
              </div>
              <div>
                <div className="text-lg font-bold text-warning">
                  {mockCrowdData.filter(c => c.density === 'high' || c.density === 'critical').length}
                </div>
                <div className="text-xs text-muted-foreground">Alerts</div>
              </div>
            </div>
          </div>
        </Card> */}
      </div>
    </div>
  );
}