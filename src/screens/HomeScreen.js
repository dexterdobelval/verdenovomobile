import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const tips = [
  { icon: 'leaf-outline',             label: 'Separe o lixo',       desc: 'Orgânico, reciclável e rejeito em lixeiras diferentes.' },
  { icon: 'water-outline',            label: 'Limpe as embalagens',  desc: 'Enxágue antes de descartar para evitar contaminação.' },
  { icon: 'flash-outline',            label: 'Eletrônicos',          desc: 'Nunca jogue no lixo comum. Use pontos de coleta especiais.' },
  { icon: 'battery-charging-outline', label: 'Pilhas e baterias',    desc: 'Descarte em coletores específicos em farmácias e mercados.' },
];

const stats = [
  { value: '80M', label: 'ton/ano de lixo no Brasil', icon: 'trash-outline' },
  { value: '3%',  label: 'do lixo é reciclado',       icon: 'refresh-outline' },
  { value: '400', label: 'anos p/ plástico sumir',     icon: 'time-outline' },
];

function AnimatedCard({ children, delay, style }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity: fade, transform: [{ translateY: slide }] }]}>
      {children}
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Animated.View style={[styles.headerInner, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
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
          <Text style={styles.headerTitle}>Vamos reciclar{'\n'}juntos hoje?</Text>
        </Animated.View>
      </View>

      {/* CTA */}
      <AnimatedCard delay={100}>
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Mapa')} activeOpacity={0.85}>
          <View style={styles.ctaLeft}>
            <View style={styles.ctaIconWrap}>
              <Ionicons name="location" size={22} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.ctaTitle}>Encontrar ponto de coleta</Text>
              <Text style={styles.ctaSub}>Ver locais próximos a você</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </AnimatedCard>

      {/* Stats */}
      <AnimatedCard delay={200} style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Ionicons name={s.icon} size={18} color={colors.primary} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </AnimatedCard>

      {/* Dicas rápidas */}
      <AnimatedCard delay={300}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dicas rápidas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Dicas')}>
            <Text style={styles.sectionLink}>Ver mais</Text>
          </TouchableOpacity>
        </View>
      </AnimatedCard>

      {tips.map((tip, i) => (
        <AnimatedCard key={i} delay={380 + i * 80}>
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name={tip.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{tip.label}</Text>
              <Text style={styles.cardDesc}>{tip.desc}</Text>
            </View>
          </View>
        </AnimatedCard>
      ))}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: { backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  headerInner: {},
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 17, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.white, lineHeight: 34 },

  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginHorizontal: 16, marginTop: -20,
    borderRadius: 16, padding: 16,
    elevation: 4,
    shadowColor: '#2C3E50', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ctaIconWrap: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: 10 },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  ctaSub: { fontSize: 12, color: colors.textLight, marginTop: 2 },

  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, gap: 8 },
  statCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: 14,
    padding: 12, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 10, color: colors.textLight, textAlign: 'center', lineHeight: 13 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 16, marginTop: 24, marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  sectionLink: { fontSize: 13, fontWeight: '600', color: colors.primary },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 14,
    marginHorizontal: 16, marginBottom: 8,
    padding: 14, gap: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  cardIcon: { backgroundColor: colors.primaryLight, borderRadius: 10, padding: 9 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  cardDesc: { fontSize: 12, color: colors.textLight, marginTop: 2, lineHeight: 17 },
});
