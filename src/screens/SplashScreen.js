import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleIcon }, { scale: pulseAnim }] }]}>
          <Ionicons name="leaf" size={64} color={colors.white} />
        </Animated.View>

        <Text style={styles.title}>VerDeNovo</Text>
        <Text style={styles.subtitle}>Recicle. Conscientize. Transforme.</Text>
        <Text style={styles.desc}>
          Encontre pontos de coleta perto de você e aprenda a descartar corretamente cada tipo de resíduo.
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
  iconWrapper: {
    backgroundColor: colors.primaryDark,
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  title: { fontSize: 38, fontWeight: '800', color: colors.white, letterSpacing: 1 },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
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
