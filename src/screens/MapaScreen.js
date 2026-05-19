// Arquivo: src/screens/MapaScreen.js
// Caminho: src/screens/MapaScreen.js
// Deps: (já existentes) + src/services/api.ts
// Substitui array hardcoded por fetch da API. useMemo evita re-render dos markers
// a cada mudança de estado não relacionada. Pontos sem lat/lng são filtrados silenciosamente.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Linking, Animated, ActivityIndicator, ScrollView,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { api } from '../services/api';

const tipoConfig = {
  'Geral':             { color: colors.primary,  icon: 'leaf-outline',             pinColor: colors.primary  },
  'Papel e Plástico':  { color: '#F0A500',        icon: 'newspaper-outline',        pinColor: '#F0A500'       },
  'Eletrônicos':       { color: colors.accent,    icon: 'hardware-chip-outline',    pinColor: colors.accent   },
  'Pilhas e Baterias': { color: colors.danger,    icon: 'battery-charging-outline', pinColor: colors.danger   },
  'Medicamentos':      { color: '#9B59B6',        icon: 'medkit-outline',           pinColor: '#9B59B6'       },
};

const FILTROS = ['Todos', 'Geral', 'Papel e Plástico', 'Eletrônicos', 'Pilhas e Baterias', 'Medicamentos'];

const REGIAO_INICIAL = {
  latitude: -23.5260, longitude: -46.9050,
  latitudeDelta: 0.14, longitudeDelta: 0.14,
};

export default function MapaScreen({ navigation }) {
  const [pontos, setPontos]           = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selected, setSelected]       = useState(null);
  const [filtro, setFiltro]           = useState('Todos');
  const [loadingLoc, setLoadingLoc]   = useState(true);
  const [loadingPontos, setLoadingPontos] = useState(true);
  const [apiError, setApiError]       = useState(false);
  const mapRef  = useRef(null);
  const cardAnim = useRef(new Animated.Value(0)).current;

  // Busca localização e pontos em paralelo
  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
          .then(loc => setUserLocation(loc.coords))
          .catch(() => {});
      }
      setLoadingLoc(false);
    });

    api.get('/pontos-coleta')
      .then(({ data }) => {
        // Filtra pontos sem coordenadas para não crashar o MapView
        setPontos((data.data ?? []).filter(p => p.lat != null && p.lng != null));
      })
      .catch(() => setApiError(true))
      .finally(() => setLoadingPontos(false));
  }, []);

  // useMemo: markers só recalculados quando pontos ou filtro mudam
  const pontosFiltrados = useMemo(
    () => filtro === 'Todos' ? pontos : pontos.filter(p => p.tipo === filtro),
    [pontos, filtro],
  );

  const selecionarPonto = (ponto) => {
    setSelected(ponto);
    mapRef.current?.animateToRegion({
      latitude: ponto.lat - 0.008, longitude: ponto.lng,
      latitudeDelta: 0.03, longitudeDelta: 0.03,
    }, 400);
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  const fecharCard = () => {
    Animated.timing(cardAnim, { toValue: 0, duration: 200, useNativeDriver: true })
      .start(() => setSelected(null));
  };

  const isLoading = loadingLoc || loadingPontos;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.blobHeader} />
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.logoWrap}>
            <Image source={require('../../assets/Verdenovologo.png')} style={styles.logoImg} resizeMode="contain" />
            <Text style={styles.logoText}>VerDeNovo</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtrosScroll}>
          {FILTROS.map((f) => {
            const ativo = filtro === f;
            const cfg   = f !== 'Todos' ? tipoConfig[f] : null;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filtroBtn, ativo && { backgroundColor: cfg ? cfg.color : colors.white, borderColor: 'transparent' }]}
                onPress={() => { setFiltro(f); fecharCard(); }}
                activeOpacity={0.8}
              >
                {cfg && (
                  <View style={[styles.filtroIconWrap, { backgroundColor: ativo ? 'rgba(255,255,255,0.3)' : cfg.color + '30' }]}>
                    <Ionicons name={cfg.icon} size={14} color={ativo ? colors.white : cfg.color} />
                  </View>
                )}
                <Text style={[styles.filtroText, ativo && { color: cfg ? colors.white : colors.primary, fontWeight: '700' }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando mapa...</Text>
          </View>
        ) : apiError ? (
          <View style={styles.loading}>
            <Ionicons name="cloud-offline-outline" size={48} color={colors.textLight} />
            <Text style={styles.loadingText}>Não foi possível carregar os pontos.</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setApiError(false);
                setLoadingPontos(true);
                api.get('/pontos-coleta')
                  .then(({ data }) => setPontos((data.data ?? []).filter(p => p.lat != null && p.lng != null)))
                  .catch(() => setApiError(true))
                  .finally(() => setLoadingPontos(false));
              }}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={REGIAO_INICIAL}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {userLocation && (
              <Circle
                center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
                radius={800}
                fillColor="rgba(32,153,72,0.08)"
                strokeColor="rgba(32,153,72,0.3)"
                strokeWidth={1}
              />
            )}
            {pontosFiltrados.map((ponto) => {
              const cfg = tipoConfig[ponto.tipo] ?? tipoConfig['Geral'];
              return (
                <Marker
                  key={String(ponto.id)}
                  coordinate={{ latitude: ponto.lat, longitude: ponto.lng }}
                  onPress={() => selecionarPonto(ponto)}
                  pinColor={cfg.pinColor}
                  title={ponto.nome}
                />
              );
            })}
          </MapView>
        )}

        {!isLoading && !apiError && userLocation && (
          <TouchableOpacity
            style={styles.myLocBtn}
            onPress={() => mapRef.current?.animateToRegion({
              latitude: userLocation.latitude, longitude: userLocation.longitude,
              latitudeDelta: 0.04, longitudeDelta: 0.04,
            }, 500)}
          >
            <Ionicons name="locate" size={26} color={colors.primary} />
          </TouchableOpacity>
        )}

        {!isLoading && !apiError && (
          <View style={styles.badge}>
            <Ionicons name="location" size={12} color={colors.primary} />
            <Text style={styles.badgeText}>{pontosFiltrados.length} pontos</Text>
          </View>
        )}
      </View>

      {selected && (
        <Animated.View style={[styles.card, {
          transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [200, 0] }) }],
          opacity: cardAnim,
        }]}>
          {(() => {
            const cfg = tipoConfig[selected.tipo] ?? tipoConfig['Geral'];
            return (
              <>
                <View style={styles.cardHandle} />
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconWrap, { backgroundColor: cfg.color + '25' }]}>
                    <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardNome}>{selected.nome}</Text>
                    <View style={[styles.tipoBadge, { backgroundColor: cfg.color + '20' }]}>
                      <Text style={[styles.tipoText, { color: cfg.color }]}>{selected.tipo}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={fecharCard} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardAddress}>
                  <Ionicons name="location-outline" size={14} color={colors.textLight} />
                  <Text style={styles.cardAddressText}>{selected.endereco}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.routeBtn, { backgroundColor: cfg.color, shadowColor: cfg.color }]}
                  onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`)}
                >
                  <Ionicons name="navigate" size={16} color={colors.white} />
                  <Text style={styles.routeBtnText}>Como chegar</Text>
                </TouchableOpacity>
              </>
            );
          })()}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4EC' },
  header: { backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 14, paddingHorizontal: 20, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden', shadowColor: colors.primaryDark, shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 10, zIndex: 10 },
  blobHeader: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.1)' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  menuBtn: { width: 44, height: 44, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoImg: { width: 22, height: 22 },
  logoText: { fontSize: 17, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },
  filtrosScroll: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  filtroBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', minHeight: 44 },
  filtroIconWrap: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  filtroText: { fontSize: 13, color: 'rgba(255,255,255,0.95)', fontWeight: '500' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.textLight, textAlign: 'center' },
  retryBtn: { marginTop: 8, backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12 },
  retryText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  myLocBtn: { position: 'absolute', bottom: 80, right: 16, backgroundColor: colors.white, borderRadius: 24, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primaryDark, shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 8, borderWidth: 2, borderColor: colors.primaryLight },
  badge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, shadowColor: colors.primaryDark, shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5, borderWidth: 1.5, borderColor: colors.primaryLight },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  card: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 20, paddingTop: 12, shadowColor: colors.primaryDark, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: -6 }, elevation: 14, borderWidth: 2, borderColor: colors.primaryLight },
  cardHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  cardIconWrap: { borderRadius: 18, padding: 12 },
  cardNome: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  tipoBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tipoText: { fontSize: 11, fontWeight: '700' },
  closeBtn: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  cardAddress: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  cardAddressText: { fontSize: 13, color: colors.textLight, flex: 1 },
  routeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 24, paddingVertical: 16, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 6 },
  routeBtnText: { color: colors.white, fontWeight: '800', fontSize: 15 },
});
