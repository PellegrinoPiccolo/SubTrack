import React from 'react'
import { Text, View } from 'react-native'
import useTheme from '../../hook/ThemeHook';

const Home = () => {

  const {colorPalette} = useTheme();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorPalette.background}}>
      <Text style={{color: colorPalette.text}}>Home Screen</Text>
    </View>
  )
}

export default Home