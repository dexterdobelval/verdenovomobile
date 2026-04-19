import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const categorias = [
  {
    id: '1', icon: 'newspaper-outline', cor: colors.primary,
    titulo: 'Papel e Papelão',
    descricao: 'Reciclar papel reduz o desmatamento e o consumo de água.',
    itens: ['Jornais, revistas e folhas de papel', 'Caixas de papelão limpas e secas', 'Embalagens cartonadas (Tetra Pak)', 'Cadernos e livros velhos'],
    cuidados: ['Não recicle papel molhado, engordurado ou com restos de comida', 'Remova grampos e clipes metálicos antes de descartar', 'Papel higiênico e guardanapos usados vão no lixo orgânico'],
    curiosidade: '1 tonelada de papel reciclado salva até 20 árvores e economiza 50% de energia.',
  },
  {
    id: '2', icon: 'cube-outline', cor: colors.accent,
    titulo: 'Plástico',
    descricao: 'O plástico leva até 400 anos para se decompor na natureza.',
    itens: ['Garrafas PET (água, refrigerante)', 'Embalagens de produtos de limpeza', 'Sacolas plásticas e filme plástico', 'Potes e tampas plásticas'],
    cuidados: ['Lave e seque as embalagens antes de descartar', 'Amasse as garrafas para economizar espaço', 'Isopor tem coleta específica — não misture com plástico comum', 'Plásticos sujos com óleo ou alimento não são recicláveis'],
    curiosidade: 'Apenas 3% do plástico produzido no Brasil é reciclado. Você pode mudar isso!',
  },
  {
    id: '3', icon: 'wine-outline', cor: '#00ACC1',
    titulo: 'Vidro',
    descricao: 'O vidro pode ser reciclado infinitas vezes sem perder qualidade.',
    itens: ['Garrafas de vidro (bebidas, molhos)', 'Potes de conserva e geleia', 'Frascos de perfume e cosméticos', 'Copos e taças quebrados'],
    cuidados: ['Embale vidros quebrados em papel antes de descartar', 'Espelhos, vidros de janela e cristais não são recicláveis', 'Lâmpadas têm descarte específico — não misture com vidro comum', 'Retire tampas metálicas e descarte separadamente'],
    curiosidade: 'Reciclar vidro economiza 30% de energia em relação à produção do zero.',
  },
  {
    id: '4', icon: 'hardware-chip-outline', cor: '#F0A500',
    titulo: 'Metal',
    descricao: 'Reciclar alumínio gasta 95% menos energia que produzir do zero.',
    itens: ['Latas de alumínio (cerveja, refrigerante)', 'Latas de aço (conservas, tintas)', 'Tampas metálicas e arames', 'Panelas e utensílios velhos'],
    cuidados: ['Lave as latas para evitar odores e pragas', 'Amasse as latas para economizar espaço', 'Embalagens metalizadas (salgadinhos) geralmente não são recicláveis', 'Aerossóis vazios podem ser reciclados — nunca perfure ou queime'],
    curiosidade: 'O Brasil é líder mundial na reciclagem de latas de alumínio, reciclando mais de 97%.',
  },
  {
    id: '5', icon: 'leaf-outline', cor: '#27AE60',
    titulo: 'Orgânico',
    descricao: 'Resíduos orgânicos podem virar adubo rico para o solo.',
    itens: ['Restos de frutas, legumes e verduras', 'Borra de café e saquinhos de chá', 'Cascas de ovos', 'Restos de alimentos cozidos'],
    cuidados: ['Não misture com lixo reciclável ou rejeito', 'Considere fazer compostagem em casa', 'Carne e laticínios em excesso atraem pragas na compostagem', 'Óleo de cozinha tem descarte específico — nunca jogue na pia'],
    curiosidade: 'Cerca de 50% do lixo doméstico é orgânico e poderia virar adubo.',
  },
  {
    id: '6', icon: 'warning-outline', cor: colors.danger,
    titulo: 'Resíduos Perigosos',
    descricao: 'Esses materiais contaminam o solo e a água se descartados errado.',
    itens: ['Pilhas e baterias', 'Medicamentos vencidos', 'Lâmpadas fluorescentes e LED', 'Tintas, solventes e produtos químicos', 'Eletrônicos (celulares, computadores)'],
    cuidados: ['NUNCA jogue no lixo comum ou na pia', 'Leve a farmácias, supermercados ou ecopontos', 'Guarde em local seco e longe de crianças até o descarte', 'Baterias de carro devem ser devolvidas ao revendedor'],
    curiosidade: 'Uma única pilha pode contaminar até 600 litros de água ou 1m² de solo.',
  },
];

const fatos = [
  { texto: '1 tonelada de papel reciclado salva 20 árvores.', icon: 'leaf' },
  { texto: 'Plástico leva até 400 anos para se decompor.',    icon: 'time' },
  { texto: 'Reciclar alumínio gasta 95% menos energia.',      icon: 'flash' },
  { texto: 'O Brasil gera 80 milhões de toneladas de lixo por ano.', icon: 'earth' },
  { texto: 'Uma pilha contamina até 600 litros de água.',     icon: 'water' },
];

function AnimatedCard({ children, delay }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

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

function CatCard({ cat, isOpen, onPress, tab, setTab }) {
  const bodyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bodyAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <View style={[styles.catCard, { shadowColor: cat.cor }]}>
      <TouchableOpacity style={styles.catHeader} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.catIcon, { backgroundColor: cat.cor + '25' }]}>
          <Ionicons name={cat.icon} size={26} color={cat.cor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.catTitle}>{cat.titulo}</Text>
          <Text style={styles.catDesc}>{cat.descricao}</Text>
        </View>
        <Animated.View style={{
          transform: [{
            rotate: bodyAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
          }]
        }}>
          <Ionicons name="chevron-down" size={18} color={colors.textLight} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View style={[styles.catBody, { opacity: bodyAnim }]}>
          <View style={styles.tabs}>
            {['itens', 'cuidados', 'curiosidade'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, tab === t && { backgroundColor: cat.cor + '20' }]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabText, tab === t && { color: cat.cor, fontWeight: '700' }]}>
                  {t === 'itens' ? 'O que reciclar' : t === 'cuidados' ? 'Cuidados' : 'Curiosidade'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {tab === 'itens' && cat.itens.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <View style={[styles.dotBullet, { backgroundColor: cat.cor }]} />
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
            {tab === 'cuidados' && cat.cuidados.map((c, i) => (
              <View key={i} style={styles.cuidadoRow}>
                <Ionicons name="alert-circle-outline" size={15} color={colors.danger} style={{ marginTop: 1 }} />
                <Text style={styles.cuidadoText}>{c}</Text>
              </View>
            ))}
            {tab === 'curiosidade' && (
              <View style={[styles.curiosidadeBox, { backgroundColor: cat.cor + '15' }]}>
                <Ionicons name="bulb-outline" size={28} color={cat.cor} />
                <Text style={styles.curiosidadeText}>{cat.curiosidade}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default function DicasScreen({ navigation }) {
  const [expanded, setExpanded] = useState(null);
  const [tab, setTab] = useState('cuidados');
  const fato = useRef(fatos[Math.floor(Math.random() * fatos.length)]).current;

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
          <Text style={styles.headerTitle}>Guia de{'\n'}Reciclagem</Text>
          <Text style={styles.headerSub}>Materiais, cuidados e dicas</Text>
        </Animated.View>
      </View>

      <AnimatedCard delay={100}>
        <View style={styles.fatoCard}>
          <View style={styles.fatoIconWrap}>
            <Ionicons name={fato.icon} size={28} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fatoLabel}>💡 Você sabia?</Text>
            <Text style={styles.fatoText}>{fato.texto}</Text>
          </View>
        </View>
      </AnimatedCard>

      <AnimatedCard delay={180}>
        <Text style={styles.sectionTitle}>Materiais & Cuidados</Text>
        <Text style={styles.sectionSub}>Toque em um material para ver detalhes</Text>
      </AnimatedCard>

      {categorias.map((cat, i) => (
        <AnimatedCard key={cat.id} delay={240 + i * 60}>
          <CatCard
            cat={cat}
            isOpen={expanded === cat.id}
            onPress={() => { setExpanded(expanded === cat.id ? null : cat.id); setTab('cuidados'); }}
            tab={tab}
            setTab={setTab}
          />
        </AnimatedCard>
      ))}

      <View style={{ height: 32 }} />
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

  fatoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 28,
    margin: 20, padding: 20, gap: 16,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)',
  },
  fatoIconWrap: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, padding: 14,
  },
  fatoLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.75)', marginBottom: 5, letterSpacing: 0.4 },
  fatoText: { fontSize: 15, color: colors.white, lineHeight: 21, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginHorizontal: 20, marginBottom: 2 },
  sectionSub: { fontSize: 12, color: colors.textLight, marginHorizontal: 20, marginBottom: 14 },

  catCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    marginHorizontal: 20, marginBottom: 12,
    shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)',
  },
  catHeader: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  catIcon: { borderRadius: 20, padding: 12 },
  catTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  catDesc: { fontSize: 13, color: colors.textLight, marginTop: 3 },

  catBody: { borderTopWidth: 1, borderTopColor: '#EAF4EC' },
  tabs: { flexDirection: 'row', gap: 8, padding: 12 },
  tabBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderRadius: 16,
  },
  tabText: { fontSize: 12, color: colors.textLight, fontWeight: '500' },
  tabContent: { padding: 16, gap: 10 },

  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dotBullet: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  itemText: { fontSize: 14, color: colors.text, flex: 1, fontWeight: '500' },

  cuidadoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  cuidadoText: { fontSize: 14, color: colors.text, flex: 1, lineHeight: 20, fontWeight: '500' },

  curiosidadeBox: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 12, gap: 12, borderRadius: 20 },
  curiosidadeText: { fontSize: 15, color: colors.text, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
});
