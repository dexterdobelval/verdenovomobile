import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const valores = [
  { icon: 'leaf-outline',      color: colors.primary, bg: '#D2EFD9', titulo: 'Sustentabilidade', desc: 'Promovemos hábitos que preservam o meio ambiente para as próximas gerações.' },
  { icon: 'people-outline',    color: colors.accent,  bg: '#D6EAF8', titulo: 'Comunidade',        desc: 'Acreditamos que pequenas ações individuais geram grandes mudanças coletivas.' },
  { icon: 'bulb-outline',      color: '#F0A500',      bg: '#FDEBD0', titulo: 'Educação',           desc: 'Informação acessível é o primeiro passo para um descarte consciente.' },
  { icon: 'earth-outline',     color: '#27AE60',      bg: '#D5F5E3', titulo: 'Impacto Real',       desc: 'Cada ponto de coleta mapeado é uma oportunidade concreta de fazer a diferença.' },
];

function AnimatedCard({ children, delay }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      {children}
    </Animated.View>
  );
}

export default function SobreScreen({ navigation }) {
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
        <View style={styles.blobHeader} />
        <Animated.View style={{ opacity: headerFade, transform: [{ translateY: headerSlide }] }}>
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
          <Text style={styles.headerTitle}>Sobre{'\n'}o VerDeNovo</Text>
          <Text style={styles.headerSub}>Nossa missão e história</Text>
        </Animated.View>
      </View>

      {/* Logo + missão */}
      <AnimatedCard delay={100}>
        <View style={styles.missaoCard}>
          <View style={styles.missaoLogoWrap}>
            <Image source={require('../../assets/Verdenovologo.png')} style={styles.missaoLogo} resizeMode="contain" />
          </View>
          <Text style={styles.missaoTitulo}>Nossa Missão</Text>
          <Text style={styles.missaoTexto}>
            O VerDeNovo nasceu da vontade de tornar a reciclagem mais acessível e prática para todos. Sabemos que a intenção de reciclar existe, mas muitas vezes falta informação sobre onde e como descartar cada tipo de resíduo.
          </Text>
          <Text style={styles.missaoTexto}>
            Por isso, reunimos em um só lugar o mapa de pontos de coleta e um guia completo de reciclagem — para que cada pessoa possa agir de forma consciente, perto de casa.
          </Text>
        </View>
      </AnimatedCard>

      {/* Nossos valores */}
      <AnimatedCard delay={200}>
        <Text style={styles.sectionTitle}>Nossos Valores</Text>
        <View style={styles.valoresGrid}>
          <View style={styles.valoresRow}>
            {valores.slice(0, 2).map((v, i) => (
              <View key={i} style={[styles.valorCard, { backgroundColor: v.bg, shadowColor: v.color }]}>
                <View style={[styles.valorIconWrap, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                  <Ionicons name={v.icon} size={26} color={v.color} />
                </View>
                <Text style={[styles.valorTitulo, { color: v.color }]}>{v.titulo}</Text>
                <Text style={styles.valorDesc}>{v.desc}</Text>
              </View>
            ))}
          </View>
          <View style={styles.valoresRow}>
            {valores.slice(2, 4).map((v, i) => (
              <View key={i} style={[styles.valorCard, { backgroundColor: v.bg, shadowColor: v.color }]}>
                <View style={[styles.valorIconWrap, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                  <Ionicons name={v.icon} size={26} color={v.color} />
                </View>
                <Text style={[styles.valorTitulo, { color: v.color }]}>{v.titulo}</Text>
                <Text style={styles.valorDesc}>{v.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </AnimatedCard>

      {/* O que oferecemos */}
      <AnimatedCard delay={520}>
        <View style={styles.ofertaCard}>
          <Text style={styles.ofertaTitulo}>O que o app oferece</Text>
          {[
            { icon: 'location-outline',    text: '12 pontos de coleta mapeados em Barueri, Itapevi e região' },
            { icon: 'filter-outline',      text: 'Filtro por tipo de resíduo: geral, eletrônicos, pilhas, medicamentos e mais' },
            { icon: 'navigate-outline',    text: 'Detecção do ponto de coleta mais próximo da sua localização' },
            { icon: 'book-outline',        text: 'Guia completo de reciclagem com cuidados e curiosidades' },
            { icon: 'flash-outline',       text: 'Dados e estatísticas sobre impacto ambiental' },
          ].map((item, i) => (
            <View key={i} style={styles.ofertaRow}>
              <View style={styles.ofertaIconWrap}>
                <Ionicons name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.ofertaText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </AnimatedCard>

      {/* Versão */}
      <AnimatedCard delay={600}>
        <View style={styles.versaoCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={styles.versaoText}>VerDeNovo v1.0.0 — Feito com 💚 para o planeta</Text>
        </View>
      </AnimatedCard>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4EC' },

  header: {
    backgroundColor: colors.primary,
    paddingTop: 56, paddingBottom: 32, paddingHorizontal: 20,
    borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  blobHeader: {
    position: 'absolute', top: -50, right: -50,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
  },
  menuBtn: {
    width: 44, height: 44, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoImg: { width: 22, height: 22 },
  logoText: { fontSize: 17, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.white, lineHeight: 36 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 6 },

  missaoCard: {
    backgroundColor: colors.white,
    borderRadius: 28, margin: 20,
    padding: 24, alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    borderWidth: 2, borderColor: colors.primaryLight,
  },
  missaoLogoWrap: {
    width: 80, height: 80, borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  missaoLogo: { width: 52, height: 52 },
  missaoTitulo: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 12 },
  missaoTexto: {
    fontSize: 14, color: colors.textLight, lineHeight: 22,
    textAlign: 'center', marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: colors.text,
    marginHorizontal: 20, marginBottom: 14,
  },

  valoresGrid: {
    marginHorizontal: 20, marginBottom: 8, gap: 12,
  },
  valoresRow: {
    flexDirection: 'row', gap: 12,
  },
  valorCard: {
    flex: 1,
    borderRadius: 24, padding: 16,
    shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.85)',
    gap: 8,
    justifyContent: 'flex-start',
  },
  valorIconWrap: {
    width: 48, height: 48, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  valorTitulo: { fontSize: 14, fontWeight: '800' },
  valorDesc: { fontSize: 12, color: colors.text, lineHeight: 17, opacity: 0.7 },

  ofertaCard: {
    backgroundColor: colors.white,
    borderRadius: 28, marginHorizontal: 20, marginTop: 8,
    padding: 20,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderWidth: 2, borderColor: colors.primaryLight,
    gap: 14,
  },
  ofertaTitulo: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 2 },
  ofertaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ofertaIconWrap: {
    width: 34, height: 34, borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  ofertaText: { fontSize: 13, color: colors.textLight, flex: 1, lineHeight: 19, paddingTop: 7 },

  versaoCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 20, marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 20, paddingVertical: 12,
    borderWidth: 1.5, borderColor: colors.border,
  },
  versaoText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
});
