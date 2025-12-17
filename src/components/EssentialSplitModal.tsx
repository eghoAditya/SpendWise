import { BlurView } from 'expo-blur';
import React from 'react';
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
  onClose: () => void;
  essentialData: CategorySlice[];
  nonEssentialData: CategorySlice[];
};

export function EssentialSplitModal({
  visible,
  onClose,
  essentialData,
  nonEssentialData,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      {/* BLURRED BACKGROUND */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView intensity={40} style={StyleSheet.absoluteFill} />
      </Pressable>

      {/* CENTER CARD */}
      <View style={styles.centerWrapper}>
        <Card style={styles.modalCard}>
          <Text style={styles.title}>
            Spending breakdown
          </Text>

          {/* ESSENTIAL */}
          <Text style={styles.sectionLabel}>
            Essential
          </Text>
          {essentialData.length === 0 ? (
            <Text style={styles.emptyText}>
              No essential expenses
            </Text>
          ) : (
            <CategoryPieChart data={essentialData} />
          )}

          {/* NON ESSENTIAL */}
          <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
            Non-Essential
          </Text>
          {nonEssentialData.length === 0 ? (
            <Text style={styles.emptyText}>
              No non-essential expenses
            </Text>
          ) : (
            <CategoryPieChart data={nonEssentialData} />
          )}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
