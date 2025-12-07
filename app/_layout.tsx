import { Stack } from 'expo-router';
import React from 'react';
import { ExpensesProvider } from '../src/context/ExpensesContext';

export default function RootLayout() {
  return (
    <ExpensesProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ExpensesProvider>
  );
}
