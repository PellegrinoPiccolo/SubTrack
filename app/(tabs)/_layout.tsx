import React, { useEffect } from 'react'
import { Image, Platform, Pressable, Text, View } from 'react-native'
import { SplashScreen, Tabs, useRouter } from 'expo-router'
import TabBarButton from '../../components/TabBarButton'
import useTheme from '../../hook/ThemeHook'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HomeIcon from '../../assets/icons/home.svg'
import HomeFilled from '../../assets/icons/home_filled.svg'
import LeaderBoard from '../../assets/icons/leaderboard.svg'
import LeaderBoardFilled from '../../assets/icons/leaderboard_filled.svg'
import useSubs from '../../hook/SubsHook'
import { useTranslation } from 'react-i18next'
import Logo from '../../assets/icon.png'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import Menu from '../../assets/icons/menu.svg'
import useMenu from '../../hook/MenuHook'
import Wallet from '../../assets/icons/wallet.svg'
import WalletFilled from '../../assets/icons/wallet_filled.svg'
import CalendarToday from '../../assets/icons/calendar_today.svg'
import CalendarTodayFilled from '../../assets/icons/calendar_today_filled.svg'

const _layout = () => {

  const {t} = useTranslation();
  const router = useRouter();
  const menu = useMenu();

  SplashScreen.preventAutoHideAsync();

  const {colorPalette, loadingTheme} = useTheme();
  const {loadingSubs} = useSubs();
  const insets = useSafeAreaInsets();

  const getVariables = async () => {
    if(!loadingTheme && !loadingSubs) {
      await SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    getVariables();
  }, [loadingTheme, loadingSubs])

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: true, 
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        header: () => (
          <View style={{ 
            height: 60 + insets.top, 
            paddingTop: insets.top, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            borderBottomColor: colorPalette.border,
            borderBottomWidth: 1,
            backgroundColor: colorPalette.background
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                shadowColor: colorPalette.primary,
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                elevation: 6,
                backgroundColor: 'transparent',
                borderRadius: 19,
              }}>
                <LinearGradient
                  colors={[colorPalette.gradientColors[0], colorPalette.gradientColors[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ 
                    borderWidth: 2, 
                    borderColor: 'transparent', 
                    borderRadius: 19,
                    backgroundColor: colorPalette.background
                  }}
                >
                  <View style={{
                    padding: 5, 
                    backgroundColor: colorPalette.background, 
                    borderRadius: 15, 
                    margin: Platform.OS === 'ios' ? 1 : 3
                  }}>
                    <Image source={Logo} style={{ width: 30, height: 30, borderRadius: 5 }} />
                  </View>
                </LinearGradient>
              </View>
              <MaskedView
                style={{ marginLeft: 10 }}
                maskElement={
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'normal',
                    color: 'black'
                  }}>
                    SubTrack
                  </Text>
                }
              >
                <LinearGradient
                  colors={[colorPalette.gradientColors[0], colorPalette.gradientColors[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'normal',
                    opacity: 0
                  }}>
                    SubTrack
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>
            <Pressable onPress={() => menu.openMenu()}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colorPalette.backgroundSecondary, borderRadius: 10 }}>
                <Menu width={20} height={20} fill={colorPalette.text} />
              </View>
            </Pressable>
          </View>
        ),
        tabBarInactiveTintColor: colorPalette.textSecondary,
        tabBarStyle: { 
          backgroundColor: colorPalette.background,
          height: 70 + insets.bottom,
          paddingTop: 10,
          borderTopColor: colorPalette.border,
          elevation: 0,
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            return focused ? 
            <View style={{
              backgroundColor: colorPalette.primary + '33',
              borderRadius: 15,
              padding: 5,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 65,
              height: 65,
              marginTop: 15
            }}>
              <HomeFilled width={30} height={30} fill={colorPalette.primary} /> 
              <Text style={{ color: colorPalette.primary, fontSize: 10, marginTop: 2 }}>{t('tabBar.home')}</Text>
            </View> : 
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 65, height: 65, marginTop: 15 }}>
              <HomeIcon width={30} height={30} fill={colorPalette.textSecondary} /> 
              <Text style={{ color: colorPalette.textSecondary, fontSize: 10, marginTop: 2 }}>{t('tabBar.home')}</Text>
            </View>
          },
          tabBarActiveTintColor: colorPalette.primary,
        }} 
      />
      <Tabs.Screen 
        name="wallet" 
        options={{ 
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            return focused ? 
            <View style={{
              backgroundColor: colorPalette.tertiary + '33',
              borderRadius: 15,
              padding: 5,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 65,
              height: 65,
              marginTop: 15
            }}>
              <WalletFilled width={30} height={30} fill={colorPalette.tertiary} /> 
              <Text style={{ color: colorPalette.tertiary, fontSize: 10, marginTop: 2 }}>{t('tabBar.wallet')}</Text>
            </View> : 
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 65, height: 65, marginTop: 15 }}>
              <Wallet width={30} height={30} fill={colorPalette.textSecondary} /> 
              <Text style={{ color: colorPalette.textSecondary, fontSize: 10, marginTop: 2 }}>{t('tabBar.wallet')}</Text>
            </View>
          },
          tabBarActiveTintColor: colorPalette.tertiary,
        }} 
      />
      <Tabs.Screen 
        name="calendar" 
        options={{ 
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            return focused ? 
            <View style={{
              backgroundColor: colorPalette.quartary + '33',
              borderRadius: 15,
              padding: 5,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 65,
              height: 65,
              marginTop: 15
            }}>
              <CalendarTodayFilled width={30} height={30} fill={colorPalette.quartary} /> 
              <Text style={{ color: colorPalette.quartary, fontSize: 10, marginTop: 2 }}>{t('tabBar.calendar')}</Text>
            </View> : 
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 65, height: 65, marginTop: 15 }}>
              <CalendarToday width={30} height={30} fill={colorPalette.textSecondary} /> 
              <Text style={{ color: colorPalette.textSecondary, fontSize: 10, marginTop: 2 }}>{t('tabBar.calendar')}</Text>
            </View>
          },
          tabBarActiveTintColor: colorPalette.quartary,
        }} 
      />
      <Tabs.Screen 
        name="category" 
        options={{ 
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            return focused ? 
            <View style={{
              backgroundColor: colorPalette.secondary + '33',
              borderRadius: 15,
              padding: 5,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 65,
              height: 65,
              marginTop: 15
            }}>
              <LeaderBoardFilled width={30} height={30} fill={colorPalette.secondary} /> 
              <Text style={{ color: colorPalette.secondary, fontSize: 10, marginTop: 2 }}>{t('tabBar.categories')}</Text>
            </View> : 
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 65, height: 65, marginTop: 15 }}>
              <LeaderBoard width={30} height={30} fill={colorPalette.textSecondary} /> 
              <Text style={{ color: colorPalette.textSecondary, fontSize: 10, marginTop: 2 }}>{t('tabBar.categories')}</Text>
            </View>
          },
          tabBarActiveTintColor: colorPalette.secondary,
        }} 
      />
    </Tabs>
  )
}

export default _layout