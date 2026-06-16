import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createTransaction } from '../firebase/firestoreService';
import { auth } from '../firebase/firebaseConfig';

type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  AddIncome: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddIncome'>;

export default function AddIncomeScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsedAmount = Number(amount);

    if (!title.trim() || !category.trim()) {
      Alert.alert('Missing info', 'Please enter a title and a category.');
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    setSaving(true);

    try {
      const userId = auth.currentUser?.uid ?? '';
      await createTransaction({
        title: title.trim(),
        category: category.trim(),
        amount: parsedAmount,
        date: new Date().toLocaleString(),
        isExpense: false,
      }, userId);

      navigation.goBack();
    } catch (error) {
Alert.alert('Error', 'We could not save the income. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Income</Text>
      <Text style={styles.subtitle}>Register a new income and keep your balance updated.</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Salary"
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Salary"
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="2500.00"
          placeholderTextColor="#9ca3af"
          keyboardType="decimal-pad"
        />

        <Pressable
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Income'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f7fb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#4b5563',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
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
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
