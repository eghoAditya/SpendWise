import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spaces';
import { Card } from './Card';
import { CategoryPieChart, CategorySlice } from './CategoryPieChart';

type Props = {
  visible: boolean;
  monthLabel: string;
  essentialData: CategorySlice[];
  nonEssentialData: CategorySlice[];
  essentialTotal: number;
  nonEssentialTotal: number;
  onClose: () => void;
};

export function EssentialSplitModal({
  visible,
  monthLabel,
  essentialData,
  nonEssentialData,
  essentialTotal,
  nonEssentialTotal,
  onClose,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 16,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.9);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Background blur */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView
          intensity={90}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      </Pressable>

      {/* Modal */}
      <Animated.View
        style={[
          styles.container,
          { opacity, transform: [{ scale }] },
        ]}
      >
        <Card style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.month}>{monthLabel} overview</Text>
            <Pressable onPress={onClose}>
              <Ionicons
                name="close"
                size={22}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          {/* Essential */}
          <Text style={styles.sectionTitle}>Essential</Text>
          {essentialData.length === 0 ? (
            <Text style={styles.emptyText}>No essential spending</Text>
          ) : (
            <>
              <CategoryPieChart data={essentialData} />
              <Text style={styles.total}>
                ₹{essentialTotal.toLocaleString()}
              </Text>
            </>
          )}

          <View style={styles.divider} />

          {/* Non-Essential */}
          <Text style={styles.sectionTitle}>Non-Essential</Text>
          {nonEssentialData.length === 0 ? (
            <Text style={styles.emptyText}>No non-essential spending</Text>
          ) : (
            <>
              <CategoryPieChart data={nonEssentialData} />
              <Text style={styles.total}>
                ₹{nonEssentialTotal.toLocaleString()}
              </Text>
            </>
          )}
        </Card>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  month: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  total: {
    marginTop: spacing.sm,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.lg,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
});
