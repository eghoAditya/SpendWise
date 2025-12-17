import { Screen } from '@/src/components/Screen';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spaces';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Ionicons
          name="analytics-outline"
          size={22}
          color={colors.accent}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.title}>Past 3 months analytics</Text>
      </View>

      <Text style={styles.subtitle}>
        Track how your spending changes month by month.
      </Text>

      {/* Charts will go here next */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});
