import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import AddIncomeScreen from './screens/AddIncomeScreen';
import EditTransactionScreen from './screens/EditTransactionScreen';
import { FirestoreTransaction } from './firebase/firestoreService';

type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  AddIncome: undefined;
  EditTransaction: { transaction: FirestoreTransaction };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#111827',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: '700',
            },
            contentStyle: {
              backgroundColor: '#f5f7fb',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Finance Tracker' }}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{ title: 'Add Expense' }}
          />
          <Stack.Screen
            name="AddIncome"
            component={AddIncomeScreen}
            options={{ title: 'Add Income' }}
          />
          <Stack.Screen
            name="EditTransaction"
            component={EditTransactionScreen}
            options={{ title: 'Edit Transaction' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
