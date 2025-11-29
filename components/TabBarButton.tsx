import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import useTheme from '../hook/ThemeHook';
import { LinearGradient } from 'expo-linear-gradient';

const TabBarButton = (props: any) => {

  const { colorPalette } = useTheme();

  return (
    <Pressable onPress={props.onPress} style={{
      shadowColor: colorPalette.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.40,
      shadowRadius: 4.65,
      elevation: 6,
    }}>
      <LinearGradient 
        colors={[colorPalette.gradientColors[0], colorPalette.gradientColors[1]]} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={[styles.button, { borderRadius: 20 }]}
      >
          <Ionicons name="add-circle" size={30} color="white" />
      </LinearGradient>
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