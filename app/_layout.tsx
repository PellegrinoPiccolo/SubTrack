import { Stack } from 'expo-router'
import React, { useContext, useEffect } from 'react'
import { Platform, StatusBar } from 'react-native'
import ThemeProvider, { ThemeContext } from '../context/ThemeContext'
import SubsProvider from '../context/SubsContext'
import i18n from '../i18n'
import { I18nextProvider } from 'react-i18next'
import * as Notifications from 'expo-notifications';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import * as Updates from 'expo-updates';
import { registerForPushNotificationsAsync } from '../utils/notificationsChannel'
import MenuProvider from '../context/MenuContext'
import CurrencyProvider from '../context/CurrencyContext'

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

  const onFetchUpdateAsync = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // Notify user about update and reload the app
        await Updates.reloadAsync();
      } else {
        console.log("No updates available");
      }
    } catch (e) {
      console.error("Error checking for updates:", e);
    }
  };

  useEffect(() => {
    onFetchUpdateAsync();
    registerForPushNotificationsAsync() ;
  }, []);

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
      <Stack.Screen
        name='add'
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name='selectSub'
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
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <SubsProvider>
          <CurrencyProvider>
            <MenuProvider>
              <RootLayout />
            </MenuProvider>
          </CurrencyProvider>
        </SubsProvider>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default _layout