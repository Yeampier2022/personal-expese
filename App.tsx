import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onIdTokenChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import { FirestoreTransaction } from './firebase/firestoreService';

import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import AddIncomeScreen from './screens/AddIncomeScreen';
import EditTransactionScreen from './screens/EditTransactionScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

type AppStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  AddIncome: undefined;
  EditTransaction: { transaction: FirestoreTransaction };
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const stackOptions = {
  headerStyle: { backgroundColor: '#111827' },
  headerTintColor: '#ffffff',
  headerTitleStyle: { fontWeight: '700' as const },
  contentStyle: { backgroundColor: '#f5f7fb' },
  headerShadowVisible: false,
};

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={stackOptions}>
      <AppStack.Screen name="Home" component={HomeScreen} options={{ title: 'Finance Tracker' }} />
      <AppStack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
      <AppStack.Screen name="AddIncome" component={AddIncomeScreen} options={{ title: 'Add Income' }} />
      <AppStack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ title: 'Edit Transaction' }} />
    </AppStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
});
