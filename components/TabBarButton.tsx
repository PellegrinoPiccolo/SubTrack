import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import useTheme from '../hook/ThemeHook';

const TabBarButton = (props: any) => {

  const { colorPalette } = useTheme();

  return (
    <Pressable onPress={props.onPress}>
      <View style={[styles.button, { backgroundColor: colorPalette.primary }]} >
          <Ionicons name="add-circle" size={30} color="white" />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: -35,
    width: 70,
    height: 70,
    borderRadius: 20,
  },
})

export default TabBarButton