import { Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import ThemeProvider from '../context/ThemeContext'

const _layout = () => {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name='(tabs)'  options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}

export default _layout