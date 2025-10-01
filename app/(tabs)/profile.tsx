import Colors from '@/constants/colors';
import { useRailway } from '@/contexts/RailwayContext';
import { BADGES } from '@/data/mockData';
import {
    Award,
    Calendar,
    Leaf,
    MapPin,
    Star,
    Train,
    TrendingUp,
    User,
    Zap
} from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, userStats, userBadges, trips } = useRailway();
  const insets = useSafeAreaInsets();

  const getBadgeIcon = (iconName: string) => {
    const iconProps = { size: 20, color: Colors.background };
    switch (iconName) {
      case 'train':
        return <Train {...iconProps} />;
      case 'map-pin':
        return <MapPin {...iconProps} />;
      case 'repeat':
        return <TrendingUp {...iconProps} />;
      case 'leaf':
        return <Leaf {...iconProps} />;
      case 'globe':
        return <MapPin {...iconProps} />;
      case 'route':
        return <Train {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#6B7280';
      case 'rare':
        return '#3B82F6';
      case 'epic':
        return '#8B5CF6';
      case 'legendary':
        return '#F59E0B';
      default:
        return Colors.textSecondary;
    }
  };

  const StatCard = ({ 
    iconName, 
    title, 
    value, 
    subtitle, 
    color 
  }: { 
    iconName: string; 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    color: string; 
  }) => {
    const getIcon = () => {
      const iconProps = { size: 20, color: Colors.background };
      switch (iconName) {
        case 'train':
          return <Train {...iconProps} />;
        case 'map-pin':
          return <MapPin {...iconProps} />;
        case 'trending-up':
          return <TrendingUp {...iconProps} />;
        case 'leaf':
          return <Leaf {...iconProps} />;
        default:
          return <Train {...iconProps} />;
      }
    };

    return (
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          {getIcon()}
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    );
  };

  const BadgeItem = ({ badgeId, isNew }: { badgeId: string; isNew?: boolean }) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return null;

    return (
      <View style={[styles.badgeItem, { backgroundColor: getBadgeColor(badge.rarity) }]}>
        {isNew && <View style={styles.newBadge} />}
        <View style={styles.badgeIcon}>
          <View>{getBadgeIcon(badge.icon)}</View>
        </View>
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
      </View>
    );
  };

  const recentTrips = trips.slice(-3).reverse();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.profileIcon}>
          <User color={Colors.background} size={32} />
        </View>
        <Text style={styles.headerTitle}>{user.name}</Text>
        <Text style={styles.headerSubtitle}>
          Railway Traveler since {user.joinedAt.getFullYear()}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            iconName="train"
            title="Total Trips"
            value={userStats.totalTrips}
            color={Colors.primary}
          />
          <StatCard
            iconName="map-pin"
            title="Stations Visited"
            value={userStats.uniqueStations}
            color={Colors.accent}
          />
          <StatCard
            iconName="trending-up"
            title="Distance"
            value={`${userStats.totalDistance}km`}
            color={Colors.primary}
          />
          <StatCard
            iconName="leaf"
            title="CO₂ Saved"
            value={`${userStats.totalCo2Saved}kg`}
            color={Colors.success}
          />
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Zap color={Colors.accent} size={24} />
            <Text style={styles.streakTitle}>Travel Streak</Text>
          </View>
          <View style={styles.streakStats}>
            <View style={styles.streakStat}>
              <Text style={styles.streakNumber}>{userStats.currentStreak}</Text>
              <Text style={styles.streakLabel}>Current</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakStat}>
              <Text style={styles.streakNumber}>{userStats.longestStreak}</Text>
              <Text style={styles.streakLabel}>Best</Text>
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Achievements ({userBadges.length})</Text>
          {userBadges.length > 0 ? (
            <View style={styles.badgesGrid}>
              {userBadges.map((userBadge: { badgeId: React.Key | null | undefined; isNew: boolean | undefined; }) => (
                <BadgeItem
                  key={String(userBadge.badgeId)}
                  badgeId={userBadge.badgeId ? String(userBadge.badgeId) : ''}
                  isNew={userBadge.isNew}
                />
              ))}
            </View>
          ) : (
            <View style={styles.noBadges}>
              <Award color={Colors.textSecondary} size={48} />
              <Text style={styles.noBadgesText}>No badges yet</Text>
              <Text style={styles.noBadgesSubtext}>
                Start traveling to earn your first achievement!
              </Text>
            </View>
          )}
        </View>

        {/* Recent Trips */}
        <View style={styles.recentTripsSection}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          {recentTrips.length > 0 ? (
            <View style={styles.tripsList}>
              {recentTrips.map((trip: {
                id: string;
                fromStation: { name: string };
                toStation: { name: string };
                date: Date;
                co2Saved: number;
              }) => (
                <View key={trip.id} style={styles.tripItem}>
                  <View style={styles.tripRoute}>
                    <Text style={styles.tripFrom}>{trip.fromStation.name}</Text>
                    <Train color={Colors.textSecondary} size={16} />
                    <Text style={styles.tripTo}>{trip.toStation.name}</Text>
                  </View>
                  <View style={styles.tripDetails}>
                    <View style={styles.tripDetail}>
                      <Calendar color={Colors.textSecondary} size={12} />
                      <Text style={styles.tripDetailText}>
                        {trip.date.toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.tripDetail}>
                      <Leaf color={Colors.success} size={12} />
                      <Text style={styles.tripDetailText}>
                        {trip.co2Saved}kg CO₂ saved
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noTrips}>
              <Train color={Colors.textSecondary} size={48} />
              <Text style={styles.noTripsText}>No trips yet</Text>
              <Text style={styles.noTripsSubtext}>
                Log your first railway journey to get started!
              </Text>
            </View>
          )}
        </View>

        {/* Rank Card */}
        <View style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <Star color={Colors.accent} size={24} />
            <Text style={styles.rankTitle}>Global Ranking</Text>
          </View>
          <View style={styles.rankContent}>
            <Text style={styles.rankNumber}>#{userStats.rank}</Text>
            <Text style={styles.rankPoints}>{userStats.points} points</Text>
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
    backgroundColor: Colors.primary,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.background,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.background,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  streakCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  streakStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakStat: {
    alignItems: 'center',
    flex: 1,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  badgesSection: {
    marginBottom: 30,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  badgeIcon: {
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 10,
    color: Colors.background,
    opacity: 0.8,
    textAlign: 'center',
  },
  noBadges: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  noBadgesText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
  },
  noBadgesSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  recentTripsSection: {
    marginBottom: 30,
  },
  tripsList: {
    gap: 12,
  },
  tripItem: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tripFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  tripTo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDetailText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  noTrips: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  noTripsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
  },
  noTripsSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  rankCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.background,
    marginLeft: 8,
  },
  rankContent: {
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.background,
  },
  rankPoints: {
    fontSize: 16,
    color: Colors.background,
    opacity: 0.8,
    marginTop: 4,
  },
});