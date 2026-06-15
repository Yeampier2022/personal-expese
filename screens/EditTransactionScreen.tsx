import { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updateTransaction, FirestoreTransaction } from '../firebase/firestoreService';

type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  AddIncome: undefined;
  EditTransaction: { transaction: FirestoreTransaction };
};

type Props = NativeStackScreenProps<RootStackParamList, 'EditTransaction'>;

export default function EditTransactionScreen({ navigation, route }: Props) {
  const { transaction } = route.params;

  const [title, setTitle] = useState(transaction.title);
  const [category, setCategory] = useState(transaction.category);
  const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
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
      await updateTransaction(transaction.firestoreId, {
        title: title.trim(),
        category: category.trim(),
        amount: transaction.isExpense ? -parsedAmount : parsedAmount,
      });

      Alert.alert('Updated', 'Transaction updated successfully.');
      navigation.goBack();
    } catch (error) {
Alert.alert('Error', 'Could not update the transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit {transaction.isExpense ? 'Expense' : 'Income'}</Text>
      <Text style={styles.subtitle}>Update the details of this transaction.</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#9ca3af"
          keyboardType="decimal-pad"
        />

        <View style={styles.buttonContainer}>
          <Button
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </View>

      <View style={styles.secondaryButtonContainer}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
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
    marginBottom: 18,
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
  buttonContainer: {
    width: '100%',
  },
  secondaryButtonContainer: {
    width: '100%',
  },
});
