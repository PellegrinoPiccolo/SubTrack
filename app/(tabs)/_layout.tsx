import React, { useEffect } from 'react'
import { Image, Platform, Text, View } from 'react-native'
import { SplashScreen, Tabs, useRouter } from 'expo-router'
import TabBarButton from '../../components/TabBarButton'
import useTheme from '../../hook/ThemeHook'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HomeIcon from '../../assets/icons/home.svg'
import HomeFilled from '../../assets/icons/home_filled.svg'
import LeaderBoard from '../../assets/icons/leaderboard.svg'
import LeaderBoardFilled from '../../assets/icons/leaderboard_filled.svg'
import WbSun from '../../assets/icons/wb_sunny.svg'
import BedTime from '../../assets/icons/bedtime.svg'
import NativeButton from '../../components/NativeButton'
import useSubs from '../../hook/SubsHook'
import { useTranslation } from 'react-i18next'
import Logo from '../../assets/icon.png'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import Menu from '../../assets/icons/menu.svg'
import useMenu from '../../hook/MenuHook'

const _layout = () => {

  const {t} = useTranslation();
  const router = useRouter();
  const menu = useMenu();

  SplashScreen.preventAutoHideAsync();

  const {colorPalette, theme, changeTheme, loadingTheme} = useTheme();
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
                    Sub Track
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
                    Sub Track
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>
            {/* <NativeButton pressFunction={() => changeTheme(theme === 'light' ? 'dark' : 'light', 'manual')}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colorPalette.backgroundSecondary, borderRadius: 10 }}>
                {theme === 'light' ? <BedTime width={20} height={20} fill={colorPalette.text} /> : 
                <WbSun width={20} height={20} fill={colorPalette.text} /> }
              </View>
            </NativeButton> */}
            <NativeButton pressFunction={() => menu.openMenu()}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colorPalette.backgroundSecondary, borderRadius: 10 }}>
                <Menu width={20} height={20} fill={colorPalette.text} />
              </View>
            </NativeButton>
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
        name="add" 
        options={{
          tabBarButton: TabBarButton,
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarShowLabel: false,
        }} 
        listeners={{tabPress: (e) => {
          e.preventDefault();
          router.push('/add');
        }}} 
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