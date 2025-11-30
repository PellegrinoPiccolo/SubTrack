import { Stack } from 'expo-router'
import React, { useContext, useEffect } from 'react'
import { Platform, StatusBar } from 'react-native'
import ThemeProvider, { ThemeContext } from '../context/ThemeContext'
import SubsProvider from '../context/SubsContext'
import '../i18n'
import * as Notifications from 'expo-notifications';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


const RootLayout = () => {
  const {colorPalette, theme} = useContext(ThemeContext);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colorPalette.background);
    StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content');
    if(Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colorPalette.background);
      NavigationBar.setButtonStyleAsync(theme === 'light' ? 'dark' : 'light');
    }
  }, [colorPalette, theme]);
  
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: 'black',
        },
      }}
    >
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen 
        name='viewSub' 
        options={{ 
          headerShown: false, 
          presentation: 'modal', 
          animation: 'slide_from_right' 
        }} 
      />
      <Stack.Screen 
        name='credits' 
        options={{ 
          headerShown: false, 
          presentation: 'modal', 
          animation: 'slide_from_right' 
        }} 
      />
    </Stack>
  );
}

const _layout = () => {
  return (
    <ThemeProvider>
      <SubsProvider>
        <RootLayout />
      </SubsProvider>
    </ThemeProvider>
  )
}

export default _layout