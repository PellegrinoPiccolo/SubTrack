import { Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import ThemeProvider from '../context/ThemeContext'
import SubsProvider from '../context/SubsContext'

const _layout = () => {
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