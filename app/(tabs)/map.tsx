// map.tsx
import Colors from '@/constants/colors';
import { MapPin } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapLibreGL from '@maplibre/maplibre-react-native';

// Configure MapLibre
MapLibreGL.setAccessToken(null);

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapLibreGL.MapView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // UAE center coordinates (Abu Dhabi area)
  const centerCoordinates: [number, number] = [54.3705, 24.4539];

  // Dark mode map style
  const darkMapStyle = {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
      emirates: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      roads: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
      buildings: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#1a1a1a',
        },
      },
      {
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        paint: {
          'raster-opacity': 0.3,
          'raster-brightness-min': 0,
          'raster-brightness-max': 0.3,
          'raster-contrast': 0.2,
          'raster-saturation': -0.5,
        },
      },
      {
        id: 'emirates-fill',
        type: 'fill',
        source: 'emirates',
        paint: {
          'fill-color': '#2d3748',
          'fill-opacity': 0.5,
        },
      },
      {
        id: 'emirates-outline',
        type: 'line',
        source: 'emirates',
        paint: {
          'line-color': '#4a5568',
          'line-width': 2,
        },
      },
      {
        id: 'roads-layer',
        type: 'line',
        source: 'roads',
        paint: {
          'line-color': '#718096',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 1,
            15, 3,
            20, 8
          ],
          'line-opacity': 0.8,
        },
      },
      {
        id: 'buildings-fill',
        type: 'fill',
        source: 'buildings',
        paint: {
          'fill-color': '#4a5568',
          'fill-opacity': 0.7,
        },
      },
      {
        id: 'buildings-outline',
        type: 'line',
        source: 'buildings',
        paint: {
          'line-color': '#718096',
          'line-width': 1,
        },
      },
    ],
  };

  useEffect(() => {
    loadGeospatialData();
  }, []);

  const loadGeospatialData = async () => {
    try {
      setIsLoading(true);
      
      // Load GeoPackage/GeoJSON files
      // Note: You'll need to convert .gpkg to GeoJSON or use a library to read .gpkg
      // For now, this is a placeholder that demonstrates the structure
      
      // Example: Load from bundled assets or fetch from server
      // const emiratesData = await fetch('path/to/emirates.geojson').then(r => r.json());
      // const roadsData = await fetch('path/to/filtered_roads.geojson').then(r => r.json());
      // const buildingsData = await fetch('path/to/buildings.geojson').then(r => r.json());
      
      // Update sources with actual data
      // This would be done through MapLibre's source management
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading geospatial data:', error);
      setMapError('Failed to load map data');
      setIsLoading(false);
      Alert.alert(
        'Map Error',
        'Could not load geospatial data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (mapError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <MapPin size={24} color={Colors.text} />
          <Text style={styles.headerTitle}>Map</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{mapError}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <MapPin size={24} color={Colors.text} />
        <Text style={styles.headerTitle}>Map</Text>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading map data...</Text>
        </View>
      )}

      <MapLibreGL.MapView
        ref={mapRef}
        style={styles.map}
        styleJSON={JSON.stringify(darkMapStyle)}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapLibreGL.Camera
          zoomLevel={11}
          centerCoordinate={centerCoordinates}
          animationDuration={0}
        />

        {/* Emirates Layer - Polygons */}
        <MapLibreGL.ShapeSource
          id="emiratesSource"
          shape={{
            type: 'FeatureCollection',
            features: [],
          }}
        >
          <MapLibreGL.FillLayer
            id="emiratesFillLayer"
            style={{
              fillColor: '#2d3748',
              fillOpacity: 0.5,
            }}
          />
          <MapLibreGL.LineLayer
            id="emiratesLineLayer"
            style={{
              lineColor: '#4a5568',
              lineWidth: 2,
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* Roads Layer - LineStrings */}
        <MapLibreGL.ShapeSource
          id="roadsSource"
          shape={{
            type: 'FeatureCollection',
            features: [],
          }}
        >
          <MapLibreGL.LineLayer
            id="roadsLayer"
            style={{
              lineColor: '#718096',
              lineWidth: 3,
              lineOpacity: 0.8,
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* Buildings Layer - Polygons */}
        <MapLibreGL.ShapeSource
          id="buildingsSource"
          shape={{
            type: 'FeatureCollection',
            features: [],
          }}
        >
          <MapLibreGL.FillLayer
            id="buildingsFillLayer"
            style={{
              fillColor: '#4a5568',
              fillOpacity: 0.7,
            }}
          />
          <MapLibreGL.LineLayer
            id="buildingsLineLayer"
            style={{
              lineColor: '#718096',
              lineWidth: 1,
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    gap: 12,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
