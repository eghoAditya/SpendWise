import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spaces';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'accent';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const isAccent = variant === 'accent';

  return (
    <View
      style={[
        styles.card,
        isAccent && styles.accentCard,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#020617',
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  accentCard: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
});
