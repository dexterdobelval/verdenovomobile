import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const items = [
  { name: 'Início', icon: 'home-outline', iconActive: 'home' },
  { name: 'Mapa', icon: 'location-outline', iconActive: 'location' },
  { name: 'Dicas', icon: 'leaf-outline', iconActive: 'leaf' },
];

export default function DrawerMenu(props) {
  const current = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="leaf" size={22} color={colors.white} />
          </View>
          <View>
            <Text style={styles.appName}>VerDeNovo</Text>
            <Text style={styles.appSub}>Reciclagem & Consciência</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

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
                  color={active ? colors.primaryDark : colors.textLight}
                />
              </View>
              <Text style={[styles.itemText, active && styles.itemTextActive]}>
                {item.name}
              </Text>
              {active && <View style={styles.activeBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footerBox}>
        <Ionicons name="earth-outline" size={15} color={colors.textMuted} />
        <Text style={styles.footer}>Juntos por um planeta mais limpo</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoIcon: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 10,
  },
  appName: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: 0.3 },
  appSub: { fontSize: 11, color: colors.textLight, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20, marginBottom: 8 },
  menu: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  menuLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    paddingHorizontal: 4,
    marginBottom: 8,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  itemActive: { backgroundColor: colors.primaryLight },
  itemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconWrapActive: { backgroundColor: colors.primaryMid },
  itemText: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textLight },
  itemTextActive: { color: colors.primaryDark, fontWeight: '700' },
  activeBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  footerBox: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footer: { fontSize: 12, color: colors.textMuted },
});
