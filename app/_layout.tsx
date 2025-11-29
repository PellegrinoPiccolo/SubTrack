import { Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import ThemeProvider from '../context/ThemeContext'
import SubsProvider from '../context/SubsContext'
import '../i18n'
import * as Notifications from 'expo-notifications';


const _layout = () => {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      // Add these two properties to satisfy the NotificationBehavior type
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return (
    <ThemeProvider>
      <SubsProvider>
        <Stack>
          <Stack.Screen name='(tabs)'  options={{ headerShown: false }} />
        </Stack>
      </SubsProvider>
    </ThemeProvider>
  )
}

export default _layout