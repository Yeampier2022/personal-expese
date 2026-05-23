import * as FileSystem from 'expo-file-system/legacy';

export type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  isExpense: boolean;
};

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
    const parsed = JSON.parse(raw) as Transaction[];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load transactions', error);
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await FileSystem.writeAsStringAsync(STORAGE_PATH, JSON.stringify(transactions));
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  const currentTransactions = await loadTransactions();
  const updatedTransactions = [transaction, ...currentTransactions];

  await saveTransactions(updatedTransactions);
}
