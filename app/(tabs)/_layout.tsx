import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: colors.borderSubtle,
        },
      }}
    >
      {/* DASHBOARD */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ADD */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="add-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* EXPENSES */}
      <Tabs.Screen
        name="two"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ANALYTICS (VISIBLE ICON + LABEL + CUSTOM NAVIGATION) */}
      <Tabs.Screen
        name="analytics-placeholder"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="stats-chart-outline"
              size={size}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/analytics')}
              style={props.style}
            >
              {props.children}
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
