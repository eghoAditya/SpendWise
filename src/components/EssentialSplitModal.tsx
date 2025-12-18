import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useMemo } from 'react';
import {
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
  onClose: () => void;
};

export function EssentialSplitModal({
  visible,
  monthLabel,
  essentialData,
  nonEssentialData,
  onClose,
}: Props) {
  const essentialTotal = useMemo(
    () => essentialData.reduce((s, c) => s + c.amount, 0),
    [essentialData]
  );

  const nonEssentialTotal = useMemo(
    () => nonEssentialData.reduce((s, c) => s + c.amount, 0),
    [nonEssentialData]
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          <Card style={styles.card}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {monthLabel} breakdown
              </Text>
              <Pressable onPress={onClose}>
                <Ionicons
                  name="close"
                  size={22}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            {/* ESSENTIAL */}
            {essentialData.length > 0 && (
              <>
                <Text style={styles.section}>Essential</Text>
                <CategoryPieChart data={essentialData} />
                <Text style={styles.total}>
                  ₹{essentialTotal.toLocaleString()}
                </Text>
              </>
            )}

            {/* NON ESSENTIAL */}
            {nonEssentialData.length > 0 && (
              <>
                <Text style={[styles.section, { marginTop: spacing.lg }]}>
                  Non-essential
                </Text>
                <CategoryPieChart data={nonEssentialData} />
                <Text style={styles.total}>
                  ₹{nonEssentialTotal.toLocaleString()}
                </Text>
              </>
            )}
          </Card>
        </View>
      </BlurView>
    </Modal>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  section: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  total: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
