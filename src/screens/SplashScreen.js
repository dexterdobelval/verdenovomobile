import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme';

export default function SplashScreen({ navigation }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleIcon = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleIcon, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, delay: 200, useNativeDriver: true }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Blobs decorativos clay */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        <Animated.View style={[styles.logoWrap, { transform: [{ scale: scaleIcon }, { scale: pulseAnim }] }]}>
          <Image source={require('../../assets/Verdenovologo.png')} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Text style={styles.title}>VerDeNovo</Text>
        <Text style={styles.subtitle}>Descarte certo. Planeta melhor.</Text>
        <Text style={styles.desc}>
          Encontre pontos de coleta perto de você e saiba como descartar lixo do jeito certo.
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Main')} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    overflow: 'hidden',
  },
  blobTop: {
    position: 'absolute', top: -80, right: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  blobBottom: {
    position: 'absolute', bottom: -60, left: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  content: { alignItems: 'center', width: '100%' },
  logoWrap: {
    width: 130, height: 130,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)',
  },
  logo: { width: 80, height: 80 },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  desc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
  },
  buttonText: { fontSize: 17, fontWeight: '800', color: colors.primaryDark },
});
