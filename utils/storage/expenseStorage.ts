import * as FileSystem from 'expo-file-system/legacy';
import { Transaction, TransactionProps } from '../models/Transaction';
export { Transaction, TransactionProps } from '../models/Transaction';

const STORAGE_ROOT = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

if (!STORAGE_ROOT) {
  throw new Error('No storage directory available');
}

const STORAGE_PATH = `${STORAGE_ROOT}transactions.json`;

export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(STORAGE_PATH);

    if (!fileInfo.exists) {
      return [];
    }

    const raw = await FileSystem.readAsStringAsync(STORAGE_PATH);
    const parsed = JSON.parse(raw) as TransactionProps[];

    return Array.isArray(parsed) ? parsed.map(Transaction.fromJSON) : [];
  } catch (error) {
    console.error('Failed to load transactions', error);
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await FileSystem.writeAsStringAsync(STORAGE_PATH, JSON.stringify(transactions.map((transaction) => transaction.toJSON())));
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  transaction.validate();

  const currentTransactions = await loadTransactions();
  const updatedTransactions = [transaction, ...currentTransactions];

  await saveTransactions(updatedTransactions);
}
