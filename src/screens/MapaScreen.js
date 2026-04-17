import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Linking, Animated, ActivityIndicator, ScrollView,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const pontos = [
  // Barueri
  {
    id: '1', nome: 'Ecoponto Barueri Centro',
    tipo: 'Geral',
    endereco: 'R. Cel. Marcos Rodrigues de Barros, 300 – Barueri',
    lat: -23.5044, lng: -46.8761,
  },
  {
    id: '2', nome: 'Recicla Jardim Silveira',
    tipo: 'Papel e Plástico',
    endereco: 'R. Henriqueta Mendes Guerra, 550 – Jd. Silveira, Barueri',
    lat: -23.4963, lng: -46.8901,
  },
  {
    id: '3', nome: 'TechRecicla Barueri',
    tipo: 'Eletrônicos',
    endereco: 'Av. Sebastião Davino dos Reis, 680 – Barueri',
    lat: -23.5118, lng: -46.8643,
  },
  {
    id: '4', nome: 'PilhaPoint Engenho Novo',
    tipo: 'Pilhas e Baterias',
    endereco: 'R. Guilherme Lorenzini, 1200 – Engenho Novo, Barueri',
    lat: -23.5081, lng: -46.8812,
  },
  {
    id: '5', nome: 'EcoFarma Barueri',
    tipo: 'Medicamentos',
    endereco: 'R. Tupinambás, 88 – Centro, Barueri',
    lat: -23.5009, lng: -46.8698,
  },
  {
    id: '6', nome: 'Coleta Verde Barueri Norte',
    tipo: 'Papel e Plástico',
    endereco: 'Av. Presidente Médici, 430 – Barueri',
    lat: -23.4881, lng: -46.8774,
  },
  // Itapevi
  {
    id: '7', nome: 'Ecoponto Itapevi Centro',
    tipo: 'Geral',
    endereco: 'Av. Presidente Vargas, 500 – Centro, Itapevi',
    lat: -23.5488, lng: -46.9338,
  },
  {
    id: '8', nome: 'EletroDescarte Itapevi',
    tipo: 'Eletrônicos',
    endereco: 'R. Benedito Rodrigues, 90 – Jd. Nova Itapevi',
    lat: -23.5421, lng: -46.9271,
  },
  {
    id: '9', nome: 'BateriaRecicla Itapevi',
    tipo: 'Pilhas e Baterias',
    endereco: 'R. Américo Emílio Romi, 340 – Itapevi',
    lat: -23.5561, lng: -46.9398,
  },
  {
    id: '10', nome: 'Descarte Seguro Itapevi',
    tipo: 'Medicamentos',
    endereco: 'R. Sete de Setembro, 155 – Centro, Itapevi',
    lat: -23.5508, lng: -46.9312,
  },
  {
    id: '11', nome: 'Coleta Verde Itapevi Sul',
    tipo: 'Papel e Plástico',
    endereco: 'R. João Pessoa, 210 – Jd. Briquet, Itapevi',
    lat: -23.5612, lng: -46.9258,
  },
  {
    id: '12', nome: 'Ecoponto Itapevi Leste',
    tipo: 'Geral',
    endereco: 'R. das Acácias, 88 – Jd. Paulista, Itapevi',
    lat: -23.5447, lng: -46.9189,
  },
];

const tipoConfig = {
  'Geral':             { color: colors.primary,  icon: 'leaf-outline',              pinColor: colors.primary  },
  'Papel e Plástico':  { color: '#F0A500',        icon: 'newspaper-outline',         pinColor: '#F0A500'       },
  'Eletrônicos':       { color: colors.accent,    icon: 'hardware-chip-outline',     pinColor: colors.accent   },
  'Pilhas e Baterias': { color: colors.danger,    icon: 'battery-charging-outline',  pinColor: colors.danger   },
  'Medicamentos':      { color: '#9B59B6',        icon: 'medkit-outline',            pinColor: '#9B59B6'       },
};

const FILTROS = ['Todos', 'Geral', 'Papel e Plástico', 'Eletrônicos', 'Pilhas e Baterias', 'Medicamentos'];

const REGIAO_INICIAL = {
  latitude: -23.5260,
  longitude: -46.9050,
  latitudeDelta: 0.14,
  longitudeDelta: 0.14,
};

export default function MapaScreen({ navigation }) {
  const [userLocation, setUserLocation]   = useState(null);
  const [selected, setSelected]           = useState(null);
  const [filtro, setFiltro]               = useState('Todos');
  const [loadingLoc, setLoadingLoc]       = useState(true);
  const mapRef                            = useRef(null);
  const cardAnim                          = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation(loc.coords);
      }
      setLoadingLoc(false);
    })();
  }, []);

  const pontosFiltrados = filtro === 'Todos' ? pontos : pontos.filter(p => p.tipo === filtro);

  const selecionarPonto = (ponto) => {
    setSelected(ponto);
    mapRef.current?.animateToRegion({
      latitude: ponto.lat - 0.008,
      longitude: ponto.lng,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    }, 400);
    Animated.spring(cardAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  const fecharCard = () => {
    Animated.timing(cardAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setSelected(null));
  };

  const abrirMaps = (item) => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`);
  };

  const irParaMinhaLocalizacao = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    }, 500);
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
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

        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtrosScroll}>
          {FILTROS.map((f) => {
            const ativo = filtro === f;
            const cfg = f !== 'Todos' ? tipoConfig[f] : null;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filtroBtn, ativo && { backgroundColor: cfg ? cfg.color : colors.white }]}
                onPress={() => { setFiltro(f); fecharCard(); }}
                activeOpacity={0.8}
              >
                {cfg && (
                  <View style={[styles.filtroIconWrap, { backgroundColor: ativo ? 'rgba(255,255,255,0.25)' : cfg.color + '30' }]}>
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

      {/* Mapa */}
      <View style={styles.mapContainer}>
        {loadingLoc ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando mapa...</Text>
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
              const cfg = tipoConfig[ponto.tipo];
              return (
                <Marker
                  key={ponto.id}
                  coordinate={{ latitude: ponto.lat, longitude: ponto.lng }}
                  onPress={() => selecionarPonto(ponto)}
                  pinColor={cfg.pinColor}
                  title={ponto.nome}
                />
              );
            })}
          </MapView>
        )}

        {/* Botão minha localização */}
        {userLocation && (
          <TouchableOpacity style={styles.myLocBtn} onPress={irParaMinhaLocalizacao}>
            <Ionicons name="locate" size={26} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* Badge contagem */}
        <View style={styles.badge}>
          <Ionicons name="location" size={12} color={colors.primary} />
          <Text style={styles.badgeText}>{pontosFiltrados.length} pontos</Text>
        </View>
      </View>

      {/* Card do ponto selecionado */}
      {selected && (
        <Animated.View style={[styles.card, {
          transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [200, 0] }) }],
          opacity: cardAnim,
        }]}>
          {(() => {
            const cfg = tipoConfig[selected.tipo];
            return (
              <>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconWrap, { backgroundColor: cfg.color + '18' }]}>
                    <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardNome}>{selected.nome}</Text>
                    <View style={[styles.tipoBadge, { backgroundColor: cfg.color + '18' }]}>
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

                <TouchableOpacity style={[styles.routeBtn, { backgroundColor: cfg.color }]} onPress={() => abrirMaps(selected)}>
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
  container: { flex: 1, backgroundColor: colors.background },

  header: { backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 12, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  menuBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoImg: { width: 20, height: 20 },
  logoText: { fontSize: 17, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },

  filtrosScroll: { flexDirection: 'row', gap: 8, flexWrap: 'nowrap', paddingBottom: 8 },
  filtroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)',
    minHeight: 44,
  },
  filtroIconWrap: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  filtroText: { fontSize: 13, color: 'rgba(255,255,255,0.95)', fontWeight: '500' },

  mapContainer: { flex: 1 },
  map: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.textLight },

  myLocBtn: {
    position: 'absolute', bottom: 80, right: 16,
    backgroundColor: colors.white, borderRadius: 30,
    width: 56, height: 56,
    alignItems: 'center', justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  badge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.white, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.primaryDark },

  card: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20,
    elevation: 12,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  cardIconWrap: { borderRadius: 12, padding: 10 },
  cardNome: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  tipoBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  tipoText: { fontSize: 11, fontWeight: '600' },
  closeBtn: { padding: 4 },
  cardAddress: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  cardAddressText: { fontSize: 13, color: colors.textLight, flex: 1 },
  routeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 14, paddingVertical: 14,
  },
  routeBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
