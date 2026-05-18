import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.blob} />
          <View style={styles.blob2} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <Image source={require('../../assets/Verdenovologo.png')} style={styles.logoImg} resizeMode="contain" />
          </View>
          <Text style={styles.headerTitle}>Bem-vindo de volta!</Text>
          <Text style={styles.headerSub}>Entre na sua conta VerDeNovo</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>

          {/* Email */}
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={20} color={colors.primaryMid} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Senha */}
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.primaryMid} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setShowSenha(v => !v)} style={styles.eyeBtn}>
              <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão entrar */}
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8}>
            <Ionicons name="leaf" size={18} color={colors.white} />
            <Text style={styles.loginBtnText}>Entrar</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Cadastro */}
          <TouchableOpacity style={styles.registerBtn} activeOpacity={0.8}>
            <Text style={styles.registerBtnText}>Criar uma conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>🌱 Descarte certo. Planeta melhor.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#EAF4EC' },
  container: { flexGrow: 1, backgroundColor: '#EAF4EC', paddingBottom: 40 },

  header: {
    paddingTop: 60, paddingBottom: 40, paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderBottomRightRadius: 48,
    borderBottomLeftRadius: 48,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  blob: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  blob2: {
    position: 'absolute', bottom: -20, left: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 72, height: 72, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoImg: { width: 46, height: 46 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  card: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 24,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.9)',
  },
  cardTitle: {
    fontSize: 20, fontWeight: '900', color: colors.text,
    marginBottom: 20,
  },

  label: {
    fontSize: 13, fontWeight: '700', color: colors.textLight,
    marginBottom: 8, marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EAF4EC',
    borderRadius: 18, borderWidth: 1.5, borderColor: colors.primaryLight,
    paddingHorizontal: 14, marginBottom: 16,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.text },
  eyeBtn: { padding: 4 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -8 },
  forgotText: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  loginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 24, paddingVertical: 16,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  loginBtnText: { fontSize: 16, fontWeight: '800', color: colors.white },

  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },

  registerBtn: {
    borderRadius: 24, paddingVertical: 15,
    borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center',
  },
  registerBtnText: { fontSize: 15, fontWeight: '800', color: colors.primary },

  footer: {
    textAlign: 'center', fontSize: 12,
    color: colors.textMuted, marginTop: 8,
  },
});
