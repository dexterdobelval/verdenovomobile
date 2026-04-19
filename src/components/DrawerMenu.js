import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const items = [
  { name: 'Início', icon: 'home-outline',           iconActive: 'home' },
  { name: 'Mapa',   icon: 'location-outline',        iconActive: 'location' },
  { name: 'Dicas',  icon: 'leaf-outline',            iconActive: 'leaf' },
  { name: 'Sobre',  icon: 'information-circle-outline', iconActive: 'information-circle' },
];

export default function DrawerMenu(props) {
  const current = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>

      {/* Header clay */}
      <View style={styles.header}>
        <View style={styles.blob} />
        <View style={styles.logoCircle}>
          <Image source={require('../../assets/Verdenovologo.png')} style={styles.logoImg} resizeMode="contain" />
        </View>
        <Text style={styles.appName}>VerDeNovo</Text>
        <Text style={styles.appSub}>Reciclagem & Consciência</Text>
      </View>

      {/* Nav items */}
      <View style={styles.menu}>
        <Text style={styles.menuLabel}>NAVEGAÇÃO</Text>
        {items.map((item) => {
          const active = current === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => props.navigation.navigate(item.name)}
              activeOpacity={0.75}
            >
              <View style={[styles.itemIconWrap, active && styles.itemIconWrapActive]}>
                <Ionicons
                  name={active ? item.iconActive : item.icon}
                  size={20}
                  color={active ? colors.white : colors.textLight}
                />
              </View>
              <Text style={[styles.itemText, active && styles.itemTextActive]}>
                {item.name}
              </Text>
              {active && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.shareBtn}
          activeOpacity={0.75}
          onPress={() => Share.share({
            message: 'Conheça o VerDeNovo! 🌱 Encontre pontos de coleta perto de você e aprenda a descartar o lixo do jeito certo. Baixe agora e ajude o planeta!',
            title: 'VerDeNovo – Reciclagem & Consciência',
          })}
        >
          <View style={styles.shareIconWrap}>
            <Ionicons name="share-social-outline" size={20} color={colors.primary} />
          </View>
          <Text style={styles.shareText}>Compartilhar o app</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerBox}>
        <Ionicons name="earth-outline" size={15} color={colors.textMuted} />
        <Text style={styles.footer}>Juntos por um planeta mais limpo</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4EC' },

  header: {
    paddingTop: 60, paddingBottom: 28, paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderBottomRightRadius: 40,
    alignItems: 'flex-start',
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  blob: {
    position: 'absolute', top: -30, right: -30,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  logoCircle: {
    width: 64, height: 64, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoImg: { width: 40, height: 40 },
  appName: { fontSize: 22, fontWeight: '900', color: colors.white, letterSpacing: 0.3 },
  appSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },

  menu: { paddingHorizontal: 16, paddingTop: 24, gap: 10 },
  menuLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.4, paddingHorizontal: 6, marginBottom: 6,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 16, paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.9)',
  },
  itemActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderColor: colors.primaryMid,
  },
  itemIconWrap: {
    width: 38, height: 38, borderRadius: 14,
    backgroundColor: '#EAF4EC',
    alignItems: 'center', justifyContent: 'center',
  },
  itemIconWrapActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  itemText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textLight },
  itemTextActive: { color: colors.white, fontWeight: '800' },
  activeDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8, marginHorizontal: 4 },

  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 16, paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.9)',
  },
  shareIconWrap: {
    width: 38, height: 38, borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  shareText: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.primaryDark },

  footerBox: {
    position: 'absolute', bottom: 32, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  footer: { fontSize: 12, color: colors.textMuted },
});
