import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const pontos = [
  { id: '1', nome: 'Ecoponto Central',  tipo: 'Geral',            endereco: 'Rua das Flores, 120',   distancia: '0,8 km', lat: -23.55, lng: -46.63 },
  { id: '2', nome: 'Coleta Verde',      tipo: 'Eletrônicos',      endereco: 'Av. Brasil, 450',        distancia: '1,2 km', lat: -23.56, lng: -46.64 },
  { id: '3', nome: 'Recicla Fácil',     tipo: 'Papel e Plástico', endereco: 'Rua do Comércio, 88',   distancia: '2,0 km', lat: -23.57, lng: -46.62 },
  { id: '4', nome: 'PontoLimpo',        tipo: 'Pilhas e Baterias',endereco: 'Av. Paulista, 1000',    distancia: '2,5 km', lat: -23.58, lng: -46.65 },
  { id: '5', nome: 'EcoFarma',          tipo: 'Medicamentos',     endereco: 'Rua da Saúde, 33',      distancia: '3,1 km', lat: -23.59, lng: -46.61 },
];

const tipoConfig = {
  'Geral':             { color: colors.primary, icon: 'leaf-outline' },
  'Eletrônicos':       { color: colors.accent,  icon: 'hardware-chip-outline' },
  'Papel e Plástico':  { color: '#F0A500',       icon: 'newspaper-outline' },
  'Pilhas e Baterias': { color: colors.danger,   icon: 'battery-charging-outline' },
  'Medicamentos':      { color: '#9B59B6',       icon: 'medkit-outline' },
};

function AnimatedCard({ children, delay, style }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity: fade, transform: [{ translateY: slide }] }]}>
      {children}
    </Animated.View>
  );
}

export default function MapaScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  const abrirMapa = (item) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`);
  };

  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={{ opacity: headerFade, transform: [{ translateY: headerSlide }] }}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.logoWrap}>
              <Ionicons name="leaf" size={18} color={colors.white} />
              <Text style={styles.logoText}>VerDeNovo</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
          <Text style={styles.headerTitle}>Pontos de{'\n'}Coleta</Text>
          <View style={styles.headerBadge}>
            <Ionicons name="location" size={13} color={colors.primary} />
            <Text style={styles.headerBadgeText}>{pontos.length} locais encontrados</Text>
          </View>
        </Animated.View>
      </View>

      <FlatList
        data={pontos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const isSelected = selected === item.id;
          const config = tipoConfig[item.tipo];
          return (
            <AnimatedCard delay={index * 80}>
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(isSelected ? null : item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.cardIconWrap, { backgroundColor: config.color + '18' }]}>
                    <Ionicons name={config.icon} size={20} color={config.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{item.nome}</Text>
                    <View style={styles.addressRow}>
                      <Ionicons name="location-outline" size={12} color={colors.textLight} />
                      <Text style={styles.addressText}>{item.endereco}</Text>
                    </View>
                  </View>
                  <View style={styles.distWrap}>
                    <Text style={styles.distText}>{item.distancia}</Text>
                  </View>
                </View>

                <View style={styles.cardBottom}>
                  <View style={[styles.badge, { backgroundColor: config.color + '15' }]}>
                    <Text style={[styles.badgeText, { color: config.color }]}>{item.tipo}</Text>
                  </View>
                  <Ionicons
                    name={isSelected ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.textLight}
                  />
                </View>

                {isSelected && (
                  <TouchableOpacity
                    style={[styles.routeBtn, { backgroundColor: config.color }]}
                    onPress={() => abrirMapa(item)}
                  >
                    <Ionicons name="navigate" size={16} color={colors.white} />
                    <Text style={styles.routeBtnText}>Abrir no Google Maps</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </AnimatedCard>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: { backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
  },
  menuBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 17, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.white, lineHeight: 34 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.white, alignSelf: 'flex-start',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10,
  },
  headerBadgeText: { fontSize: 12, fontWeight: '600', color: colors.primaryDark },

  list: { padding: 16, gap: 10 },

  card: {
    backgroundColor: colors.white, borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  cardSelected: { borderColor: colors.primary, borderWidth: 1.5 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  cardIconWrap: { borderRadius: 12, padding: 10 },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 3 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  addressText: { fontSize: 12, color: colors.textLight },
  distWrap: {
    backgroundColor: colors.background, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  distText: { fontSize: 12, fontWeight: '600', color: colors.text },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  routeBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingVertical: 11,
    justifyContent: 'center', gap: 6, marginTop: 12,
  },
  routeBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
