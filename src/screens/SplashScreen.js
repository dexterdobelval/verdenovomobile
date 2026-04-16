import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme';

export default function SplashScreen({ navigation }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleIcon = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrada: ícone escala + conteúdo fade/slide
    Animated.parallel([
      Animated.spring(scaleIcon, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, delay: 200, useNativeDriver: true }),
    ]).start(() => {
      // Pulso suave no ícone após entrada
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
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        <Animated.View style={{ transform: [{ scale: scaleIcon }, { scale: pulseAnim }], marginBottom: 24 }}>
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
  },
  content: { alignItems: 'center', width: '100%' },
  logo: { width: 112, height: 112 },
  title: {
    fontSize: 42,
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
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.primaryDark },
});
