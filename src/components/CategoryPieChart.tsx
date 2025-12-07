import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 48; // account for padding/margins a bit

export type CategorySlice = {
  key: string;
  label: string;
  amount: number;
  color: string;
};

interface CategoryPieChartProps {
  data: CategorySlice[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    population: item.amount,
    color: item.color,
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={chartWidth}
        height={220}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
        hasLegend={true}
        chartConfig={{
          backgroundColor: '#020617',
          backgroundGradientFrom: '#020617',
          backgroundGradientTo: '#020617',
          decimalPlaces: 0,
          color: () => colors.textPrimary,
          labelColor: () => colors.textSecondary,
        }}
        center={[0, 0]}
        avoidFalseZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
