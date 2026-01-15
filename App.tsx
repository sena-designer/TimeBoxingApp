import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nProvider } from './src/hooks/useI18n';
import { ThemeProvider } from './src/hooks/useTheme';
import { DayViewScreen } from './src/screens/DayViewScreen';
import { EditScreen } from './src/screens/EditScreen';
import { FocusScreen } from './src/screens/FocusScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TimeBox } from './src/types';

// Navigation types
export type RootStackParamList = {
  DayView: undefined;
  Edit: {
    timeBoxId?: string;
    date: string;
  };
  Focus: {
    timeBoxId: string;
    timeBox: TimeBox;
  };
  Result: {
    timeBox: TimeBox;
    earlyComplete?: boolean;
  };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="DayView"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="DayView" component={DayViewScreen} />
            <Stack.Screen
              name="Edit"
              component={EditScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="Focus"
              component={FocusScreen}
              options={{
                gestureEnabled: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{
                gestureEnabled: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nProvider>
    </ThemeProvider>
  );
}

