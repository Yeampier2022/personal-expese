import { useCallback, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { loadTransactions, Transaction } from '../utils/storage/expenseStorage';

type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  AddIncome: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshTransactions = useCallback(async () => {
    const savedTransactions = await loadTransactions();
    setTransactions(savedTransactions);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshTransactions();
    }, [refreshTransactions])
  );

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, item) => {
        acc.currentBalance += item.amount;

        if (item.isExpense) {
          acc.totalExpenses += Math.abs(item.amount);
        } else {
          acc.totalIncome += Math.abs(item.amount);
        }

        return acc;
      },
      {
        currentBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
      }
    );
  }, [transactions]);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, item.isExpense ? styles.expense : styles.income]}>
        {item.isExpense ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Finance Tracker</Text>
        <Text style={styles.subtitle}>Track income and expenses with instant balance.</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceValue}>${summary.currentBalance.toFixed(2)}</Text>
        <View style={styles.balanceStatsRow}>
          <View style={styles.balanceStatBox}>
            <Text style={styles.balanceStatLabel}>Income</Text>
            <Text style={styles.balanceStatValue}>${summary.totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.balanceStatBox}>
            <Text style={styles.balanceStatLabel}>Expenses</Text>
            <Text style={styles.balanceStatValue}>${summary.totalExpenses.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionButton, styles.expenseButton]} onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.actionButtonText}>Add Expense</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.incomeButton]} onPress={() => navigation.navigate('AddIncome')}>
          <Text style={styles.actionButtonText}>Add Income</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions saved yet.</Text>
            <Text style={styles.emptyStateSubtext}>Agrega un ingreso o gasto para comenzar.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#f5f7fb',
  },
  headerSection: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#4b5563',
    marginTop: 6,
  },
  balanceCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 18,
  },
  balanceStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  balanceStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  balanceStatLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceStatValue: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseButton: {
    backgroundColor: '#f97316',
  },
  incomeButton: {
    backgroundColor: '#059669',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    paddingRight: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  income: {
    color: '#059669',
  },
  expense: {
    color: '#dc2626',
  },
  separator: {
    height: 10,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyStateSubtext: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },
});
