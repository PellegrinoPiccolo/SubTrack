import React from 'react'
import { View } from 'react-native'
import Home from './index'
import { Tabs } from 'expo-router'
import TabBarButton from '../../components/TabBarButton'
import { Ionicons } from '@expo/vector-icons'
import useTheme from '../../hook/ThemeHook'

const _layout = () => {

  const {colorPalette} = useTheme();

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarStyle: { backgroundColor: colorPalette.background }
      }}
    >
        <Tabs.Screen 
          name="index" 
          options={{ 
            headerShown: false, 
            title: 'Home',
            tabBarIcon: () => <Ionicons name="home" size={24} color={colorPalette.text} />
          }} 
        />
        <Tabs.Screen 
          name="add" 
          options={{tabBarButton: TabBarButton}} 
          listeners={{tabPress: (e) => {}}} 
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            title: 'Profile',
            tabBarIcon: () => <Ionicons name="person" size={24} color="black" />
          }} 
        />
    </Tabs>
  )
}

export default _layout