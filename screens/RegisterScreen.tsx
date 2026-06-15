import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updateProfile } from 'firebase/auth';
import { register } from '../firebase/authService';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const credential = await register(email.trim(), password);
      await updateProfile(credential.user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });
      await credential.user.reload();
    } catch (error: any) {
const messages: Record<string, string> = {
        'auth/email-already-in-use': 'That email is already registered.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/network-request-failed': 'No internet connection.',
        'auth/operation-not-allowed': 'Email/Password sign-in is not enabled in Firebase Console.',
      };
      Alert.alert('Error', messages[error.code] ?? `${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Start tracking your finances today</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameField}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
              />
            </View>
          </View>

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

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry
          />

          <Pressable
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchLink}>Sign in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f7fb',
  },
  header: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    marginTop: 24,
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  nameField: {
    flex: 1,
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
    marginBottom: 24,
  },
  switchLink: {
    color: '#111827',
    fontWeight: '700',
  },
});
