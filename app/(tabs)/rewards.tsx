import {
    Car,
    CheckCircle,
    Clock,
    Coffee,
    Gift,
    ShoppingBag,
    Star,
    Ticket,
    Utensils
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useRailway } from '@/contexts/RailwayContext';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'travel' | 'food' | 'shopping' | 'transport';
  icon: React.ReactNode;
  imageUrl?: string;
  expiresIn?: string;
  isPopular?: boolean;
  discount?: string;
}

const REWARDS: Reward[] = [
  {
    id: '1',
    title: '20% Off Next Train Ticket',
    description: 'Get 20% discount on your next railway journey',
    pointsCost: 500,
    category: 'travel',
    icon: <Ticket color={Colors.primary} size={24} />,
    discount: '20% OFF',
    isPopular: true,
    expiresIn: '30 days',
  },
  {
    id: '2',
    title: 'Free Coffee at Station Café',
    description: 'Enjoy a complimentary coffee at participating station cafés',
    pointsCost: 200,
    category: 'food',
    icon: <Coffee color={Colors.accent} size={24} />,
    expiresIn: '14 days',
  },
  {
    id: '3',
    title: 'Free Uber Ride (up to $15)',
    description: 'Get a free ride to or from the train station',
    pointsCost: 800,
    category: 'transport',
    icon: <Car color={Colors.primary} size={24} />,
    discount: 'FREE',
    expiresIn: '7 days',
  },
  {
    id: '4',
    title: '$10 Restaurant Voucher',
    description: 'Dine at partner restaurants near train stations',
    pointsCost: 600,
    category: 'food',
    icon: <Utensils color={Colors.accent} size={24} />,
    discount: '$10 OFF',
    expiresIn: '60 days',
  },
  {
    id: '5',
    title: 'Shopping Mall Gift Card',
    description: '$25 gift card for major shopping centers',
    pointsCost: 1200,
    category: 'shopping',
    icon: <ShoppingBag color={Colors.primary} size={24} />,
    discount: '$25',
    isPopular: true,
    expiresIn: '90 days',
  },
  {
    id: '6',
    title: 'Premium Seat Upgrade',
    description: 'Upgrade to first class on your next journey',
    pointsCost: 1000,
    category: 'travel',
    icon: <Star color={Colors.accent} size={24} />,
    discount: 'UPGRADE',
    expiresIn: '45 days',
  },
];

interface RedeemedReward extends Reward {
  redeemedAt: Date;
  code: string;
  status: 'active' | 'used' | 'expired';
}

export default function RewardsScreen() {
  const { userStats } = useRailway();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);

  const categories = [
    { id: 'all', label: 'All', icon: <Gift color={Colors.textSecondary} size={16} /> },
    { id: 'travel', label: 'Travel', icon: <Ticket color={Colors.textSecondary} size={16} /> },
    { id: 'food', label: 'Food', icon: <Coffee color={Colors.textSecondary} size={16} /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag color={Colors.textSecondary} size={16} /> },
    { id: 'transport', label: 'Transport', icon: <Car color={Colors.textSecondary} size={16} /> },
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? REWARDS 
    : REWARDS.filter(reward => reward.category === selectedCategory);

  const handleRedeemReward = (reward: Reward) => {
    if (userStats.points < reward.pointsCost) {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.pointsCost - userStats.points} more points to redeem this reward.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.title}" for ${reward.pointsCost} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            const code = `RW${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
            const redeemedReward: RedeemedReward = {
              ...reward,
              redeemedAt: new Date(),
              code,
              status: 'active',
            };
            
            setRedeemedRewards(prev => [...prev, redeemedReward]);
            
            Alert.alert(
              'Reward Redeemed!',
              `Your reward code is: ${code}\n\nShow this code when using your reward.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const RewardCard = ({ reward }: { reward: Reward }) => {
    const canAfford = userStats.points >= reward.pointsCost;
    
    return (
      <TouchableOpacity
        style={[
          styles.rewardCard,
          !canAfford && styles.rewardCardDisabled,
          reward.isPopular && styles.popularReward,
        ]}
        onPress={() => handleRedeemReward(reward)}
        disabled={!canAfford}
      >
        {reward.isPopular && (
          <View style={styles.popularBadge}>
            <Star color={Colors.background} size={12} />
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
        
        <View style={styles.rewardHeader}>
          <View style={styles.rewardIcon}>
            {reward.icon}
          </View>
          {reward.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{reward.discount}</Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.rewardTitle, !canAfford && styles.disabledText]}>
          {reward.title}
        </Text>
        <Text style={[styles.rewardDescription, !canAfford && styles.disabledText]}>
          {reward.description}
        </Text>
        
        <View style={styles.rewardFooter}>
          <View style={styles.pointsContainer}>
            <Text style={[styles.pointsCost, !canAfford && styles.disabledText]}>
              {reward.pointsCost} pts
            </Text>
            {reward.expiresIn && (
              <View style={styles.expiryContainer}>
                <Clock color={Colors.textSecondary} size={12} />
                <Text style={styles.expiryText}>Expires in {reward.expiresIn}</Text>
              </View>
            )}
          </View>
          
          <View style={[
            styles.redeemButton,
            !canAfford && styles.redeemButtonDisabled,
          ]}>
            <Text style={[
              styles.redeemButtonText,
              !canAfford && styles.redeemButtonTextDisabled,
            ]}>
              {canAfford ? 'Redeem' : 'Need More Points'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Rewards Store</Text>
        <View style={styles.pointsDisplay}>
          <Gift color={Colors.primary} size={20} />
          <Text style={styles.pointsText}>{userStats.points} points</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            {category.icon}
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive,
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.rewardsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.rewardsGrid}>
          {filteredRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </View>
        
        {redeemedRewards.length > 0 && (
          <View style={styles.redeemedSection}>
            <Text style={styles.sectionTitle}>Your Redeemed Rewards</Text>
            {redeemedRewards.map((reward, index) => (
              <View key={index} style={styles.redeemedCard}>
                <View style={styles.redeemedHeader}>
                  <CheckCircle color={Colors.success} size={20} />
                  <Text style={styles.redeemedTitle}>{reward.title}</Text>
                </View>
                <Text style={styles.redeemedCode}>Code: {reward.code}</Text>
                <Text style={styles.redeemedDate}>
                  Redeemed: {reward.redeemedAt.toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.bottomPadding} />
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.background,
  },
  rewardsContainer: {
    flex: 1,
  },
  rewardsGrid: {
    padding: 20,
    gap: 16,
  },
  rewardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  rewardCardDisabled: {
    opacity: 0.6,
  },
  popularReward: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.background,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.background,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pointsContainer: {
    flex: 1,
  },
  pointsCost: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  redeemButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: Colors.border,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  redeemButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  disabledText: {
    color: Colors.textSecondary,
  },
  redeemedSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  redeemedCard: {
    backgroundColor: Colors.successLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  redeemedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  redeemedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  redeemedCode: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 4,
  },
  redeemedDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottomPadding: {
    height: 20,
  },
});