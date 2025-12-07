// app/(tabs)/explore.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/theme/colors';

export default function ExpensesScreen() {
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.title}>Expenses</Text>
        <Text style={styles.subtitle}>
          Soon you&apos;ll be able to filter, search, and explore all your spending here.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
