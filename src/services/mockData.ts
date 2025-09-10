// Mock data for Simhastha e-Move app

export interface ERickshaw {
  id: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  driver: string;
  distance: number;
  eta: number;
  fare?: number;
}

export interface ParkingLot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  occupied: number;
  available: number;
  distance: number;
  trend: 'filling' | 'stable' | 'emptying';
}

export interface Alert {
  id: string;
  type: 'vip' | 'roadblock' | 'emergency' | 'crowd' | 'weather';
  title: string;
  description: string;
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  active: boolean;
  lat: number; // Added latitude
  lng: number; // Added longitude
}

export interface CrowdData {
  lat: number;
  lng: number;
  density: 'low' | 'medium' | 'high' | 'critical';
  area: string;
}

export interface GarbageVehicle {
  id: string;
  lat: number;
  lng: number;
  status: 'active' | 'inactive' | 'maintenance';
  vehicleNo: string;
  lastUpdated: Date;
}

// Mock Ujjain coordinates (Mahakaleshwar Temple area)
const UJJAIN_CENTER = { lat: 23.1765, lng: 75.7885 };

export const mockERickshaws: ERickshaw[] = [
  {
    id: 'rick_001',
    lat: 23.1780,
    lng: 75.7890,
    status: 'available',
    driver: 'राहुल शर्मा',
    distance: 0.3,
    eta: 4,
    fare: 50
  },
  {
    id: 'rick_002',
    lat: 23.1750,
    lng: 75.7870,
    status: 'available', 
    driver: 'अमित कुमार',
    distance: 0.8,
    eta: 8,
    fare: 60
  },
  {
    id: 'rick_003',
    lat: 23.1790,
    lng: 75.7910,
    status: 'busy',
    driver: 'विकास गुप्ता',
    distance: 1.2,
    eta: 12,
  },
  {
    id: 'rick_004',
    lat: 23.1740,
    lng: 75.7860,
    status: 'available',
    driver: 'संजय पटेल',
    distance: 1.5,
    eta: 15,
    fare: 80
  },
  {
    id: 'rick_005',
    lat: 23.1800,
    lng: 75.7920,
    status: 'offline',
    driver: 'रवि यादव',
    distance: 2.1,
    eta: 20,
  },
  {
    id: 'rick_006',
    lat: 23.1820,
    lng: 75.7930,
    status: 'available',
    driver: 'अजय सिंह',
    distance: 1.8,
    eta: 18,
    fare: 70
  },
  {
    id: 'rick_007',
    lat: 23.1760,
    lng: 75.7880,
    status: 'available',
    driver: 'मनोज कुमार',
    distance: 1.0,
    eta: 10,
    fare: 55
  },
  {
    id: 'rick_008',
    lat: 23.1770,
    lng: 75.7900,
    status: 'busy',
    driver: 'सुरेश गुप्ता',
    distance: 0.9,
    eta: 9,
  },
  {
    id: 'rick_009',
    lat: 23.1810,
    lng: 75.7940,
    status: 'available',
    driver: 'दीपक शर्मा',
    distance: 2.0,
    eta: 20,
    fare: 85
  },
  {
    id: 'rick_010',
    lat: 23.1790,
    lng: 75.7950,
    status: 'available',
    driver: 'प्रकाश यादव',
    distance: 1.7,
    eta: 17,
    fare: 75
  }
];

export const mockGarbageVehicles: GarbageVehicle[] = [
  {
    id: 'gv_001',
    lat: 23.1805,
    lng: 75.7875,
    status: 'active',
    vehicleNo: 'MP09GA1234',
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: 'gv_002',
    lat: 23.1770,
    lng: 75.7900,
    status: 'active',
    vehicleNo: 'MP09GB5678',
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
  },
  {
    id: 'gv_003',
    lat: 23.1755,
    lng: 75.7865,
    status: 'maintenance',
    vehicleNo: 'MP09GC9012',
    lastUpdated: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: 'gv_004',
    lat: 23.1810,
    lng: 75.7890,
    status: 'active',
    vehicleNo: 'MP09GD3456',
    lastUpdated: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
  }
];

export const mockParkingLots: ParkingLot[] = [
  {
    id: 'park_001',
    name: 'Ramghat Parking A',
    lat: 23.1785, // Actual Ramghat location in Ujjain
    lng: 75.7895,
    capacity: 500,
    occupied: 425,
    available: 75,
    distance: 0.2,
    trend: 'filling'
  },
  {
    id: 'park_002', 
    name: 'Railway Station Parking',
    lat: 23.1827, // Actual Ujjain Railway Station coordinates
    lng: 75.7908,
    capacity: 800,
    occupied: 320,
    available: 480,
    distance: 1.1,
    trend: 'stable'
  },
  {
    id: 'park_003',
    name: 'Mahakaleshwar Parking B',
    lat: 23.1828, // Actual Mahakaleshwar Temple coordinates
    lng: 75.7681,
    capacity: 300,
    occupied: 290,
    available: 10,
    distance: 0.4,
    trend: 'filling'
  },
  {
    id: 'park_004',
    name: 'Kal Bhairav Parking',
    lat: 23.1750, // Actual Kal Bhairav Temple coordinates
    lng: 75.7870,
    capacity: 200,
    occupied: 80,
    available: 120,
    distance: 0.8,
    trend: 'emptying'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert_001',
    type: 'vip',
    title: 'VIP Movement Alert',
    description: 'मुख्यमंत्री जी का काफिला 30 मिनट में रामघाट से गुजरेगा। वैकल्पिक रास्ता अपनाएं।',
    area: 'Ramghat - Mahakaleshwar Route',
    severity: 'high',
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    active: true,
    lat: 23.1780, // Added latitude
    lng: 75.7890, // Added longitude
  },
  {
    id: 'alert_002',
    type: 'roadblock',
    title: 'Road Closure',
    description: 'Main road to temple blocked due to procession. Use alternate route via Dewas Road.',
    area: 'Temple Road Junction',
    severity: 'medium',
    timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    active: true,
    lat: 23.1755, // Added latitude
    lng: 75.7870, // Added longitude
  },
  {
    id: 'alert_003',
    type: 'crowd',
    title: 'Heavy Crowd Alert',
    description: 'भारी भीड़ के कारण रामघाट क्षेत्र में आवाजाही धीमी है। कृपया धैर्य रखें।',
    area: 'Ramghat Ghat Area',
    severity: 'high',
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    active: true,
    lat: 23.1790, // Added latitude
    lng: 75.7910, // Added longitude
  },
  {
    id: 'alert_004',
    type: 'emergency',
    title: 'Medical Emergency',
    description: 'Ambulance required at Sector 7. Please clear the way.',
    area: 'Sector 7 - Near Food Court',
    severity: 'critical',
    timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
    active: false,
    lat: 23.1740, // Added latitude
    lng: 75.7860, // Added longitude
  }
];

export const mockCrowdData: CrowdData[] = [
  { lat: 23.1828, lng: 75.7681, density: 'critical', area: 'Mahakaleshwar Temple' },
  { lat: 23.1785, lng: 75.7895, density: 'high', area: 'Ramghat' },
  { lat: 23.1750, lng: 75.7870, density: 'medium', area: 'Kal Bhairav Temple' },
  { lat: 23.1827, lng: 75.7908, density: 'low', area: 'Railway Station' },
  { lat: 23.1740, lng: 75.7860, density: 'high', area: 'Bus Station' },
  { lat: 23.1800, lng: 75.7920, density: 'medium', area: 'Dewas Road' },
];

// Helper functions for generating mock data
export const generateMockRoute = (from: string, to: string) => ({
  distance: Math.round(Math.random() * 5 + 1),
  duration: Math.round(Math.random() * 30 + 10),
  crowdLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
  steps: [
    `Head ${['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)]} on ${from} Road`,
    `Turn right onto Main Temple Road`,
    `Continue straight for 800m`,
    `Turn left at ${to} junction`,
    `Destination will be on your right`
  ]
});

export const getAlertsByType = (type: Alert['type']) => 
  mockAlerts.filter(alert => alert.type === type && alert.active);

export const getActiveAlerts = () => 
  mockAlerts.filter(alert => alert.active);

export const getNearbyRickshaws = (userLat: number, userLng: number, radius: number = 2) =>
  mockERickshaws.filter(rickshaw => {
    const distance = Math.sqrt(
      Math.pow(rickshaw.lat - userLat, 2) + Math.pow(rickshaw.lng - userLng, 2)
    ) * 100; // Rough distance calculation
    return distance <= radius;
  });

export const getAvailableParking = () =>
  mockParkingLots.filter(lot => lot.available > 0);