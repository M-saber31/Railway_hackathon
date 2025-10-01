export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
}

export interface Station {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Trip {
  id: string;
  userId: string;
  fromStation: Station;
  toStation: Station;
  date: Date;
  distance: number; // in kilometers
  co2Saved: number; // in kg
  duration?: number; // in minutes
  trainType?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'achievement' | 'environmental' | 'social';
  requirement: {
    type: 'trips' | 'stations' | 'distance' | 'co2' | 'streak';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  badgeId: string;
  unlockedAt: Date;
  isNew?: boolean;
}

export interface UserStats {
  totalTrips: number;
  uniqueStations: number;
  totalDistance: number;
  totalCo2Saved: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  points: number;
}

export interface LeaderboardEntry {
  user: User;
  stats: UserStats;
  position: number;
}