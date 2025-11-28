import React from 'react'
import { Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native'

const NativeButton = ({children, pressFunction} : {children: React.ReactNode, pressFunction: () => void})  => {
  return (
    Platform.OS === 'android' ? (
      <TouchableNativeFeedback onPress={pressFunction}>{children}</TouchableNativeFeedback>
    ) : (
      <TouchableOpacity onPress={pressFunction}>{children}</TouchableOpacity>
    )
  )
}

export default NativeButton