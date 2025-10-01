import Colors from '@/constants/colors';
import { useRailway } from '@/contexts/RailwayContext';
import { router } from 'expo-router';
import {
  Award,
  Leaf,
  MapPin,
  Plus,
  Train,
  Trophy,
  Zap
} from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { user, userStats, trips, userBadges } = useRailway();
  const insets = useSafeAreaInsets();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color,
    onPress 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    color: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <View>{icon}</View>
        </View>
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const recentTrips = trips.slice(-2).reverse();
  const newBadges = userBadges.filter((badge: { isNew: any; }) => badge.isNew).length;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}! 🚂</Text>
        </View>
        <TouchableOpacity 
          style={styles.addTripButton}
          onPress={() => router.push('/add-trip')}
        >
          <Plus color={Colors.background} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <StatCard
              icon={<Train color={Colors.background} size={20} />}
              title="Total Trips"
              value={userStats.totalTrips}
              color={Colors.primary}
              onPress={() => router.push('/profile')}
            />
            <StatCard
              icon={<MapPin color={Colors.background} size={20} />}
              title="Stations"
              value={userStats.uniqueStations}
              color={Colors.accent}
              onPress={() => router.push('/profile')}
            />
          </View>

          <View style={styles.quickStats}>
            <StatCard
              icon={<Leaf color={Colors.background} size={20} />}
              title="CO₂ Saved"
              value={`${userStats.totalCo2Saved}kg`}
              subtitle="vs car travel"
              color={Colors.success}
            />
            <StatCard
              icon={<Trophy color={Colors.background} size={20} />}
              title="Global Rank"
              value={`#${userStats.rank}`}
              subtitle={`${userStats.points} points`}
              color={Colors.accent}
              onPress={() => router.push('/leaderboard')}
            />
          </View>

          {/* Streak Card */}
          {userStats.currentStreak > 0 && (
            <View style={styles.streakCard}>
              <View style={styles.streakHeader}>
                <Zap color={Colors.accent} size={24} />
                <Text style={styles.streakTitle}>Travel Streak</Text>
              </View>
              <View style={styles.streakContent}>
                <Text style={styles.streakNumber}>{userStats.currentStreak}</Text>
                <Text style={styles.streakLabel}>days in a row</Text>
              </View>
            </View>
          )}

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {trips.length > 2 && (
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {recentTrips.length > 0 ? (
              <View style={styles.tripsList}>
                {recentTrips.map((trip: { id: React.Key | null | undefined; fromStation: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; toStation: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; date: { toLocaleDateString: () => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; co2Saved: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                  <View key={trip.id} style={styles.tripItem}>
                    <View style={styles.tripRoute}>
                      <Text style={styles.tripFrom}>{trip.fromStation.name}</Text>
                      <Train color={Colors.textSecondary} size={16} />
                      <Text style={styles.tripTo}>{trip.toStation.name}</Text>
                    </View>
                    <View style={styles.tripMeta}>
                      <Text style={styles.tripDate}>
                        {trip.date.toLocaleDateString()}
                      </Text>
                      <View style={styles.tripCo2}>
                        <Leaf color={Colors.success} size={12} />
                        <Text style={styles.tripCo2Text}>{trip.co2Saved}kg saved</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noActivity}>
                <Train color={Colors.textSecondary} size={48} />
                <Text style={styles.noActivityText}>No trips yet</Text>
                <Text style={styles.noActivitySubtext}>
                  Tap the + button to log your first journey!
                </Text>
              </View>
            )}
          </View>

          {/* Achievements */}
          {userBadges.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Achievements {newBadges > 0 && `(${newBadges} new!)`}
                </Text>
                <TouchableOpacity onPress={() => router.push('/profile')}>
                  <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.badgesList}>
                {userBadges.slice(0, 3).map((userBadge: { badgeId: React.Key | null | undefined; isNew: any; }) => (
                  <View key={userBadge.badgeId} style={styles.badgePreview}>
                    <Award color={Colors.accent} size={20} />
                    {userBadge.isNew && <View style={styles.newBadgeIndicator} />}
                  </View>
                ))}
                {userBadges.length > 3 && (
                  <View style={styles.moreBadges}>
                    <Text style={styles.moreBadgesText}>+{userBadges.length - 3}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/add-trip')}
            >
              <Plus color={Colors.primary} size={24} />
              <Text style={styles.actionButtonText}>Log Trip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/leaderboard')}
            >
              <Trophy color={Colors.accent} size={24} />
              <Text style={styles.actionButtonText}>Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
  },
  addTripButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingTop: 20,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  streakCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.background,
    marginLeft: 8,
  },
  streakContent: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.background,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.8,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
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
    marginBottom: 8,
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
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tripCo2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripCo2Text: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  noActivity: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  noActivityText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
  },
  noActivitySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  badgesList: {
    flexDirection: 'row',
    gap: 12,
  },
  badgePreview: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  newBadgeIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  moreBadges: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBadgesText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});
