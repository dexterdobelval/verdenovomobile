import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const pontos = [
  { id: '1',  nome: 'Ecoponto Barueri Centro',   tipo: 'Geral',            endereco: 'R. Cel. Marcos Rodrigues de Barros, 300 – Barueri', lat: -23.5044, lng: -46.8761 },
  { id: '2',  nome: 'Recicla Jardim Silveira',    tipo: 'Papel e Plástico', endereco: 'R. Henriqueta Mendes Guerra, 550 – Barueri',        lat: -23.4963, lng: -46.8901 },
  { id: '3',  nome: 'TechRecicla Barueri',        tipo: 'Eletrônicos',      endereco: 'Av. Sebastião Davino dos Reis, 680 – Barueri',     lat: -23.5118, lng: -46.8643 },
  { id: '4',  nome: 'PilhaPoint Engenho Novo',    tipo: 'Pilhas e Baterias',endereco: 'R. Guilherme Lorenzini, 1200 – Barueri',           lat: -23.5081, lng: -46.8812 },
  { id: '5',  nome: 'EcoFarma Barueri',           tipo: 'Medicamentos',     endereco: 'R. Tupinambás, 88 – Barueri',                      lat: -23.5009, lng: -46.8698 },
  { id: '6',  nome: 'Coleta Verde Barueri Norte', tipo: 'Papel e Plástico', endereco: 'Av. Presidente Médici, 430 – Barueri',             lat: -23.4881, lng: -46.8774 },
  { id: '7',  nome: 'Ecoponto Itapevi Centro',    tipo: 'Geral',            endereco: 'Av. Presidente Vargas, 500 – Itapevi',             lat: -23.5488, lng: -46.9338 },
  { id: '8',  nome: 'EletroDescarte Itapevi',     tipo: 'Eletrônicos',      endereco: 'R. Benedito Rodrigues, 90 – Itapevi',              lat: -23.5421, lng: -46.9271 },
  { id: '9',  nome: 'BateriaRecicla Itapevi',     tipo: 'Pilhas e Baterias',endereco: 'R. Américo Emílio Romi, 340 – Itapevi',             lat: -23.5561, lng: -46.9398 },
  { id: '10', nome: 'Descarte Seguro Itapevi',    tipo: 'Medicamentos',     endereco: 'R. Sete de Setembro, 155 – Itapevi',              lat: -23.5508, lng: -46.9312 },
  { id: '11', nome: 'Coleta Verde Itapevi Sul',   tipo: 'Papel e Plástico', endereco: 'R. João Pessoa, 210 – Itapevi',                   lat: -23.5612, lng: -46.9258 },
  { id: '12', nome: 'Ecoponto Itapevi Leste',     tipo: 'Geral',            endereco: 'R. das Acácias, 88 – Itapevi',                    lat: -23.5447, lng: -46.9189 },
];

const tipoConfig = {
  'Geral':             { color: colors.primary, icon: 'leaf-outline' },
  'Papel e Plástico':  { color: '#F0A500',       icon: 'newspaper-outline' },
  'Eletrônicos':       { color: colors.accent,   icon: 'hardware-chip-outline' },
  'Pilhas e Baterias': { color: colors.danger,   icon: 'battery-charging-outline' },
  'Medicamentos':      { color: '#9B59B6',       icon: 'medkit-outline' },
};

function distancia(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const tips = [
  { icon: 'leaf-outline',             color: colors.primary, bg: '#D2EFD9', label: 'Separe o lixo',      desc: 'Orgânico, reciclável e rejeito em lixeiras diferentes.' },
  { icon: 'water-outline',            color: colors.accent,  bg: '#D6EAF8', label: 'Limpe as embalagens', desc: 'Enxágue antes de descartar para evitar contaminação.' },
  { icon: 'flash-outline',            color: '#9B59B6',      bg: '#E8DAEF', label: 'Eletrônicos',         desc: 'Nunca jogue no lixo comum. Use pontos de coleta especiais.' },
  { icon: 'battery-charging-outline', color: '#F0A500',      bg: '#FDEBD0', label: 'Pilhas e baterias',   desc: 'Descarte em coletores específicos em farmácias e mercados.' },
];

const carrosselItems = [
  { icon: 'trash-outline',          color: colors.danger,  value: '80M',     label: 'toneladas de lixo geradas por ano no Brasil' },
  { icon: 'refresh-outline',        color: colors.primary, value: '3%',      label: 'do lixo brasileiro é efetivamente reciclado' },
  { icon: 'time-outline',           color: '#F0A500',      value: '400 anos', label: 'para o plástico se decompor na natureza' },
  { icon: 'water-outline',          color: colors.accent,  value: '1 pilha', label: 'contamina até 600 litros de água ou 1m² de solo' },
  { icon: 'earth-outline',          color: '#27AE60',      value: '8M',      label: 'toneladas de plástico vão parar nos oceanos todo ano' },
  { icon: 'flash-outline',          color: '#9B59B6',      value: '95%',     label: 'menos energia gasta ao reciclar alumínio do zero' },
  { icon: 'leaf-outline',           color: colors.primary, value: '20',      label: 'árvores salvas por tonelada de papel reciclado' },
  { icon: 'thermometer-outline',    color: colors.danger,  value: '5%',      label: 'das emissões globais de CO₂ vêm de aterros sanitários' },
  { icon: 'phone-portrait-outline', color: '#F0A500',      value: '50M',     label: 'toneladas de lixo eletrônico geradas por ano no mundo' },
  { icon: 'sunny-outline',          color: '#E67E22',      value: '1°C',     label: 'de aumento na temperatura média global desde 1880' },
  { icon: 'fish-outline',           color: colors.accent,  value: '2050',    label: 'pode ter mais plástico que peixes nos oceanos' },
  { icon: 'home-outline',           color: '#27AE60',      value: '50%',     label: 'do lixo doméstico é orgânico e poderia virar adubo' },
];

function Carrossel() {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        const next = (indexRef.current + 1) % carrosselItems.length;
        indexRef.current = next;
        setIndex(next);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const item = carrosselItems[index];

  return (
    <View style={styles.carrosselWrap}>
      <Animated.View style={[styles.carrosselCard, { opacity: fadeAnim }]}>
        <View style={[styles.carrosselIconWrap, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.carrosselValue, { color: item.color }]}>{item.value}</Text>
          <Text style={styles.carrosselLabel}>{item.label}</Text>
        </View>
      </Animated.View>
      <View style={styles.dotsRow}>
        {carrosselItems.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

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
  const [pontoProximo, setPontoProximo] = useState(null);
  const [distKm, setDistKm] = useState(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      let menor = Infinity, mais_proximo = null;
      pontos.forEach(p => {
        const d = distancia(latitude, longitude, p.lat, p.lng);
        if (d < menor) { menor = d; mais_proximo = p; }
      });
      setPontoProximo(mais_proximo);
      setDistKm(menor < 1 ? `${Math.round(menor * 1000)} m` : `${menor.toFixed(1)} km`);
    })();
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
              <Image source={require('../../assets/Verdenovologo.png')} style={styles.logoImg} resizeMode="contain" />
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
          {pontoProximo ? (() => {
            const cfg = tipoConfig[pontoProximo.tipo];
            return (
              <>
                <View style={styles.ctaLeft}>
                  <View style={[styles.ctaIconWrap, { backgroundColor: cfg.color + '18' }]}>
                    <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.ctaTopRow}>
                      <Text style={styles.ctaNearLabel}>Ponto mais próximo</Text>
                      <View style={[styles.ctaDistBadge, { backgroundColor: cfg.color + '15' }]}>
                        <Ionicons name="navigate-outline" size={11} color={cfg.color} />
                        <Text style={[styles.ctaDistText, { color: cfg.color }]}>{distKm}</Text>
                      </View>
                    </View>
                    <Text style={styles.ctaTitle} numberOfLines={1}>{pontoProximo.nome}</Text>
                    <Text style={styles.ctaSub} numberOfLines={1}>{pontoProximo.endereco}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
              </>
            );
          })() : (
            <>
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
            </>
          )}
        </TouchableOpacity>
      </AnimatedCard>

      {/* Carrossel */}
      <AnimatedCard delay={200}>
        <Carrossel />
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tipsScroll}>
        {tips.map((tip, i) => (
          <View key={i} style={[styles.tipCard, { borderTopColor: tip.color }]}>
            <View style={[styles.tipIconWrap, { backgroundColor: tip.bg }]}>
              <Ionicons name={tip.icon} size={26} color={tip.color} />
            </View>
            <Text style={[styles.tipLabel, { color: tip.color }]}>{tip.label}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: { backgroundColor: colors.primary, paddingTop: 48, paddingBottom: 24, paddingHorizontal: 20 },
  headerInner: {},
  headerTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  menuBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoImg: { width: 20, height: 20 },
  logoText: { fontSize: 17, fontWeight: '800', color: colors.white, letterSpacing: 0.5 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.white, lineHeight: 30 },

  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginHorizontal: 16, marginTop: -18,
    borderRadius: 16, padding: 14,
    elevation: 4,
    shadowColor: '#2C3E50', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  ctaIconWrap: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: 10 },
  ctaTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  ctaNearLabel: { fontSize: 11, fontWeight: '600', color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.4 },
  ctaDistBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2 },
  ctaDistText: { fontSize: 11, fontWeight: '700' },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  ctaSub: { fontSize: 12, color: colors.textLight, marginTop: 2 },

  carrosselWrap: { marginHorizontal: 16, marginTop: 12 },
  carrosselCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 16,
    padding: 14, gap: 14,
    borderWidth: 1, borderColor: colors.border,
    elevation: 2,
    shadowColor: '#2C3E50', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  carrosselIconWrap: { borderRadius: 12, padding: 9 },
  carrosselValue: { fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  carrosselLabel: { fontSize: 12, color: colors.textLight, marginTop: 2, lineHeight: 17 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.primary },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 16, marginTop: 18, marginBottom: 10,
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
  tipsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 12,
    alignItems: 'stretch',
  },
  tipCard: {
    width: 160,
    minHeight: 160,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#2C3E50', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    gap: 10,
    justifyContent: 'flex-start',
  },
  tipIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tipLabel: { fontSize: 14, fontWeight: '800' },
  tipDesc: { fontSize: 12, color: colors.textLight, lineHeight: 17, flexShrink: 1 },
});
