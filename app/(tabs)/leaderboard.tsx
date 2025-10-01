import Colors from '@/constants/colors';
import { useRailway } from '@/contexts/RailwayContext';
import { LeaderboardEntry } from '@/types';
import { Crown, Leaf, Medal, Train, Trophy } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    position: 1,
    user: { id: '1', name: 'Alex Johnson', email: 'alex@example.com', joinedAt: new Date() },
    stats: { totalTrips: 45, uniqueStations: 28, totalDistance: 12500, totalCo2Saved: 2100, currentStreak: 15, longestStreak: 22, rank: 1, points: 1875 }
  },
  {
    position: 2,
    user: { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', joinedAt: new Date() },
    stats: { totalTrips: 38, uniqueStations: 22, totalDistance: 9800, totalCo2Saved: 1650, currentStreak: 8, longestStreak: 18, rank: 2, points: 1490 }
  },
  {
    position: 3,
    user: { id: '3', name: 'Mike Rodriguez', email: 'mike@example.com', joinedAt: new Date() },
    stats: { totalTrips: 32, uniqueStations: 19, totalDistance: 8200, totalCo2Saved: 1380, currentStreak: 12, longestStreak: 16, rank: 3, points: 1235 }
  },
  {
    position: 4,
    user: { id: '4', name: 'Emma Wilson', email: 'emma@example.com', joinedAt: new Date() },
    stats: { totalTrips: 29, uniqueStations: 16, totalDistance: 7100, totalCo2Saved: 1195, currentStreak: 5, longestStreak: 14, rank: 4, points: 1070 }
  },
  {
    position: 5,
    user: { id: '5', name: 'David Kim', email: 'david@example.com', joinedAt: new Date() },
    stats: { totalTrips: 25, uniqueStations: 14, totalDistance: 6300, totalCo2Saved: 1060, currentStreak: 3, longestStreak: 11, rank: 5, points: 920 }
  },
];

export default function LeaderboardScreen() {
  const { user, userStats } = useRailway();
  const insets = useSafeAreaInsets();

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown color="#FFD700" size={24} />;
      case 2:
        return <Medal color="#C0C0C0" size={24} />;
      case 3:
        return <Medal color="#CD7F32" size={24} />;
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankNumberText}>{position}</Text>
          </View>
        );
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return Colors.textSecondary;
    }
  };

  const LeaderboardItem = ({ entry }: { entry: LeaderboardEntry }) => (
    <View style={[
      styles.leaderboardItem,
      entry.user.id === user.id && styles.currentUserItem
    ]}>
      <View style={styles.rankContainer}>
        {getRankIcon(entry.position)}
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[
          styles.userName,
          entry.user.id === user.id && styles.currentUserText
        ]}>
          {entry.user.name}
          {entry.user.id === user.id && ' (You)'}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Train color={Colors.primary} size={14} />
            <Text style={styles.statText}>{entry.stats.totalTrips} trips</Text>
          </View>
          <View style={styles.statItem}>
            <Leaf color={Colors.success} size={14} />
            <Text style={styles.statText}>{entry.stats.totalCo2Saved}kg CO₂</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.pointsContainer}>
        <Text style={[
          styles.points,
          { color: getRankColor(entry.position) }
        ]}>
          {entry.stats.points}
        </Text>
        <Text style={styles.pointsLabel}>points</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Trophy color={Colors.accent} size={32} />
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>
          Compete with fellow railway travelers
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.currentUserCard}>
          <Text style={styles.currentUserTitle}>Your Ranking</Text>
          <View style={styles.currentUserStats}>
            <View style={styles.currentUserRank}>
              <Text style={styles.currentUserRankNumber}>#{userStats.rank}</Text>
              <Text style={styles.currentUserRankLabel}>Global Rank</Text>
            </View>
            <View style={styles.currentUserPoints}>
              <Text style={styles.currentUserPointsNumber}>{userStats.points}</Text>
              <Text style={styles.currentUserPointsLabel}>Total Points</Text>
            </View>
          </View>
        </View>

        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>Top Travelers</Text>
          {MOCK_LEADERBOARD.map((entry) => (
            <LeaderboardItem key={entry.user.id} entry={entry} />
          ))}
        </View>

        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>How Points Work</Text>
          <View style={styles.pointsExplanation}>
            <View style={styles.pointsRule}>
              <Train color={Colors.primary} size={16} />
              <Text style={styles.pointsRuleText}>10 points per trip</Text>
            </View>
            <View style={styles.pointsRule}>
              <Trophy color={Colors.accent} size={16} />
              <Text style={styles.pointsRuleText}>5 points per unique station</Text>
            </View>
            <View style={styles.pointsRule}>
              <Leaf color={Colors.success} size={16} />
              <Text style={styles.pointsRuleText}>1 point per 10km traveled</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentUserCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  currentUserTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.background,
    marginBottom: 16,
    textAlign: 'center',
  },
  currentUserStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  currentUserRank: {
    alignItems: 'center',
  },
  currentUserRankNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.background,
  },
  currentUserRankLabel: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.8,
    marginTop: 4,
  },
  currentUserPoints: {
    alignItems: 'center',
  },
  currentUserPointsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.background,
  },
  currentUserPointsLabel: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.8,
    marginTop: 4,
  },
  leaderboardContainer: {
    marginBottom: 30,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  currentUserItem: {
    backgroundColor: Colors.primary,
    opacity: 0.1,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  currentUserText: {
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  howItWorksCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  pointsExplanation: {
    gap: 12,
  },
  pointsRule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsRuleText: {
    fontSize: 14,
    color: Colors.text,
  },
});