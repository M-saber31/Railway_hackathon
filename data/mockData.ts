import { Badge, Station } from '@/types';

// Mock stations data
export const STATIONS: Station[] = [
  { id: '1', name: 'Central Station', city: 'New York', country: 'USA' },
  { id: '2', name: 'Union Station', city: 'Washington', country: 'USA' },
  { id: '3', name: 'Penn Station', city: 'New York', country: 'USA' },
  { id: '4', name: 'South Station', city: 'Boston', country: 'USA' },
  { id: '5', name: 'King\'s Cross', city: 'London', country: 'UK' },
  { id: '6', name: 'Gare du Nord', city: 'Paris', country: 'France' },
  { id: '7', name: 'Hauptbahnhof', city: 'Berlin', country: 'Germany' },
  { id: '8', name: 'Milano Centrale', city: 'Milan', country: 'Italy' },
  { id: '9', name: 'Tokyo Station', city: 'Tokyo', country: 'Japan' },
  { id: '10', name: 'Shinjuku Station', city: 'Tokyo', country: 'Japan' },
];

// Badge definitions
export const BADGES: Badge[] = [
  {
    id: 'first-ride',
    name: 'First Journey',
    description: 'Complete your first train ride',
    icon: 'train',
    category: 'milestone',
    requirement: { type: 'trips', value: 1 },
    rarity: 'common'
  },
  {
    id: 'explorer',
    name: 'Station Explorer',
    description: 'Visit 5 different stations',
    icon: 'map-pin',
    category: 'milestone',
    requirement: { type: 'stations', value: 5 },
    rarity: 'common'
  },
  {
    id: 'frequent-traveler',
    name: 'Frequent Traveler',
    description: 'Complete 10 train rides',
    icon: 'repeat',
    category: 'milestone',
    requirement: { type: 'trips', value: 10 },
    rarity: 'rare'
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Save 50kg of CO₂ emissions',
    icon: 'leaf',
    category: 'environmental',
    requirement: { type: 'co2', value: 50 },
    rarity: 'rare'
  },
  {
    id: 'globe-trotter',
    name: 'Globe Trotter',
    description: 'Visit 20 different stations',
    icon: 'globe',
    category: 'achievement',
    requirement: { type: 'stations', value: 20 },
    rarity: 'epic'
  },
  {
    id: 'distance-master',
    name: 'Distance Master',
    description: 'Travel 1000km by train',
    icon: 'route',
    category: 'achievement',
    requirement: { type: 'distance', value: 1000 },
    rarity: 'epic'
  },
  {
    id: 'streak-legend',
    name: 'Streak Legend',
    description: 'Maintain a 30-day travel streak',
    icon: 'zap',
    category: 'achievement',
    requirement: { type: 'streak', value: 30 },
    rarity: 'legendary'
  }
];

// Calculate CO2 savings (average car emits 0.21 kg CO2 per km)
export const calculateCO2Savings = (distanceKm: number): number => {
  const carEmissionPerKm = 0.21; // kg CO2 per km
  const trainEmissionPerKm = 0.041; // kg CO2 per km (much lower)
  return Math.round((carEmissionPerKm - trainEmissionPerKm) * distanceKm * 100) / 100;
};

// Calculate distance between stations (mock calculation)
export const calculateDistance = (fromStation: Station, toStation: Station): number => {
  // Mock distance calculation - in real app would use coordinates
  const distances: { [key: string]: number } = {
    '1-2': 225, // NYC to Washington
    '1-3': 5,   // NYC Central to Penn
    '1-4': 215, // NYC to Boston
    '2-4': 440, // Washington to Boston
    '5-6': 334, // London to Paris
    '6-7': 878, // Paris to Berlin
    '7-8': 840, // Berlin to Milan
    '9-10': 7,  // Tokyo Station to Shinjuku
  };
  
  const key1 = `${fromStation.id}-${toStation.id}`;
  const key2 = `${toStation.id}-${fromStation.id}`;
  
  return distances[key1] || distances[key2] || Math.floor(Math.random() * 500) + 50;
};