import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { TransactionProps } from '../utils/models/Transaction';

const COLLECTION = 'transactions';

export type FirestoreTransaction = TransactionProps & { firestoreId: string };

export async function getTransactions(userId: string): Promise<FirestoreTransaction[]> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<TransactionProps, 'id'> & { createdAt?: { seconds: number } };
    return {
      firestoreId: docSnap.id,
      id: docSnap.id,
      ...data,
    };
  });
  return docs.sort((a, b) => {
    const aTime = (a as any).createdAt?.seconds ?? 0;
    const bTime = (b as any).createdAt?.seconds ?? 0;
    return bTime - aTime;
  });
}

export async function createTransaction(
  transaction: Omit<TransactionProps, 'id'>,
  userId: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...transaction,
    userId,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateTransaction(
  firestoreId: string,
  data: Partial<Omit<TransactionProps, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, firestoreId), data);
}

export async function deleteTransaction(firestoreId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, firestoreId));
}
