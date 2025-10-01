import { calculateCO2Savings, calculateDistance } from '@/data/mockData';
import { Station, Trip, User, UserBadge, UserStats } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEYS = {
  USER: 'railway_user',
  TRIPS: 'railway_trips',
  BADGES: 'railway_badges',
};

// Mock user data
const MOCK_USER: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  joinedAt: new Date('2024-01-15'),
};

type RailwayContextType = {
  user: User;
  trips: Trip[];
  userBadges: UserBadge[];
  userStats: UserStats;
  isLoading: boolean;
  addTrip: (fromStation: Station, toStation: Station, date?: Date) => Promise<Trip>;
  markBadgeAsSeen: (badgeId: string) => Promise<void>;
};

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

export function RailwayProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(MOCK_USER);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedTrips, storedBadges] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TRIPS),
          AsyncStorage.getItem(STORAGE_KEYS.BADGES),
        ]);
        if (storedTrips) {
          setTrips(JSON.parse(storedTrips).map((t: any) => ({ ...t, date: new Date(t.date) })));
        }
        if (storedBadges) {
          setUserBadges(JSON.parse(storedBadges).map((b: any) => ({ ...b, unlockedAt: new Date(b.unlockedAt) })));
        }
      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Stats
  const userStats: UserStats = useMemo(() => {
    const totalTrips = trips.length;
    const uniqueStations = new Set([...trips.map(t => t.fromStation.id), ...trips.map(t => t.toStation.id)]).size;
    const totalDistance = trips.reduce((s, t) => s + t.distance, 0);
    const totalCo2Saved = trips.reduce((s, t) => s + t.co2Saved, 0);

    return {
      totalTrips,
      uniqueStations,
      totalDistance: Math.round(totalDistance),
      totalCo2Saved: Math.round(totalCo2Saved * 100) / 100,
      currentStreak: 0,
      longestStreak: 0,
      rank: 1,
      points: totalTrips * 10 + uniqueStations * 5 + Math.floor(totalDistance / 10),
    };
  }, [trips]);

  // Add trip
  const addTrip = useCallback(async (fromStation: Station, toStation: Station, date: Date = new Date()) => {
    const distance = calculateDistance(fromStation, toStation);
    const co2Saved = calculateCO2Savings(distance);
    const newTrip: Trip = {
      id: Date.now().toString(),
      userId: user.id,
      fromStation,
      toStation,
      date,
      distance,
      co2Saved,
    };
    const updated = [...trips, newTrip];
    setTrips(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updated));
    return newTrip;
  }, [trips, user.id]);

  // Mark badge
  const markBadgeAsSeen = useCallback(async (badgeId: string) => {
    const updated = userBadges.map(b => b.badgeId === badgeId ? { ...b, isNew: false } : b);
    setUserBadges(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(updated));
  }, [userBadges]);

  const value: RailwayContextType = { user, trips, userBadges, userStats, isLoading, addTrip, markBadgeAsSeen };

  return <RailwayContext.Provider value={value}>{children}</RailwayContext.Provider>;
}

export function useRailway() {
  const ctx = useContext(RailwayContext);
  if (!ctx) throw new Error('useRailway must be used inside RailwayProvider');
  return ctx;
}
