import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { login } from '../firebase/authService';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing info', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      const message =
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : 'Login failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Tracker</Text>
        <Text style={styles.headerSubtitle}>Sign in to manage your finances</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          secureTextEntry
        />

        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.switchText}>
          Don't have an account? <Text style={styles.switchLink}>Create one</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f7fb',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#cbd5e1',
    fontSize: 15,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    color: '#111827',
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  switchText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  switchLink: {
    color: '#111827',
    fontWeight: '700',
  },
});
