import { Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name='(tabs)'  options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout