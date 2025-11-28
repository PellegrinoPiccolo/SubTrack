import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import useTheme from '../hook/ThemeHook';

const TabBarButton = () => {

  const { colorPalette } = useTheme();

  return (
    <View style={[styles.button, { backgroundColor: colorPalette.primary }]} >
        <Ionicons name="add-circle" size={30} color="white" />
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: -30,
    width: 70,
    height: 70,
    borderRadius: 20,
  },
})

export default TabBarButton