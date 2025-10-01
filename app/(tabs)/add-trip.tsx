import Colors from '@/constants/colors';
import { useRailway } from '@/contexts/RailwayContext';
import { STATIONS } from '@/data/mockData';
import { Station } from '@/types';
import { MapPin, Plus, Train } from 'lucide-react-native';
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

export default function AddTripScreen() {
  const { addTrip } = useRailway();
  const insets = useSafeAreaInsets();
  const [fromStation, setFromStation] = useState<Station | null>(null);
  const [toStation, setToStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTrip = async () => {
    if (!fromStation || !toStation) {
      Alert.alert('Error', 'Please select both departure and arrival stations');
      return;
    }

    if (fromStation.id === toStation.id) {
      Alert.alert('Error', 'Departure and arrival stations must be different');
      return;
    }

    setIsLoading(true);
    try {
      const trip = await addTrip(fromStation, toStation);
      Alert.alert(
        'Trip Added! 🚂',
        `Your journey from ${fromStation.name} to ${toStation.name} has been logged. You saved ${trip.co2Saved}kg of CO₂!`,
        [
          {
            text: 'Great!',
            onPress: () => {
              setFromStation(null);
              setToStation(null);
            },
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to add trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const StationSelector = ({
    title,
    selectedStation,
    onSelect,
    iconColor,
  }: {
    title: string;
    selectedStation: Station | null;
    onSelect: (station: Station) => void;
    iconColor: string;
  }) => (
    <View style={styles.selectorContainer}>
      <View style={styles.selectorHeader}>
        <MapPin color={iconColor} size={20} />
        <Text style={styles.selectorTitle}>{title}</Text>
      </View>
      
      {selectedStation ? (
        <TouchableOpacity
          style={styles.selectedStation}
          onPress={() => onSelect(selectedStation)}
        >
          <Text style={styles.selectedStationName}>{selectedStation.name}</Text>
          <Text style={styles.selectedStationCity}>
            {selectedStation.city}, {selectedStation.country}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.selectPrompt}>Tap to select a station</Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.stationList}
        contentContainerStyle={styles.stationListContent}
      >
        {STATIONS.map((station) => (
          <TouchableOpacity
            key={station.id}
            style={[
              styles.stationCard,
              selectedStation?.id === station.id && styles.stationCardSelected,
            ]}
            onPress={() => onSelect(station)}
          >
            <Text style={[
              styles.stationName,
              selectedStation?.id === station.id && styles.stationNameSelected,
            ]}>
              {station.name}
            </Text>
            <Text style={[
              styles.stationCity,
              selectedStation?.id === station.id && styles.stationCitySelected,
            ]}>
              {station.city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Train color={Colors.primary} size={32} />
        <Text style={styles.headerTitle}>Log Your Journey</Text>
        <Text style={styles.headerSubtitle}>
          Track your railway travels and earn rewards
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StationSelector
          title="From"
          selectedStation={fromStation}
          onSelect={setFromStation}
          iconColor={Colors.primary}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerIcon}>
            <Train color={Colors.textSecondary} size={16} />
          </View>
          <View style={styles.dividerLine} />
        </View>

        <StationSelector
          title="To"
          selectedStation={toStation}
          onSelect={setToStation}
          iconColor={Colors.success}
        />

        <TouchableOpacity
          style={[
            styles.addButton,
            (!fromStation || !toStation || isLoading) && styles.addButtonDisabled,
          ]}
          onPress={handleAddTrip}
          disabled={!fromStation || !toStation || isLoading}
        >
          <Plus color={Colors.background} size={24} />
          <Text style={styles.addButtonText}>
            {isLoading ? 'Adding Trip...' : 'Add Trip'}
          </Text>
        </TouchableOpacity>
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
  selectorContainer: {
    marginVertical: 20,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  selectedStation: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedStationName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.background,
  },
  selectedStationCity: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.8,
    marginTop: 4,
  },
  selectPrompt: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  stationList: {
    marginHorizontal: -20,
  },
  stationListContent: {
    paddingHorizontal: 20,
  },
  stationCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stationCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  stationNameSelected: {
    color: Colors.background,
  },
  stationCity: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  stationCitySelected: {
    color: Colors.background,
    opacity: 0.8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerIcon: {
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginTop: 30,
    marginBottom: 40,
  },
  addButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
  addButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});