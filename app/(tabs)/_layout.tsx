import React, { useEffect } from 'react'
import { View } from 'react-native'
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

const _layout = () => {

  const {t} = useTranslation();
  const router = useRouter();

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
        headerStyle: {
          backgroundColor: colorPalette.background,
          borderBottomColor: colorPalette.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: colorPalette.text,
          fontSize: 18,
        },
        headerRight: () => (
          <NativeButton pressFunction={() => changeTheme(theme === 'light' ? 'dark' : 'light', 'manual')}>
            <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
              {theme === 'light' ? <BedTime width={20} height={20} fill={colorPalette.text} /> : 
              <WbSun width={20} height={20} fill={colorPalette.text} /> }
            </View>
          </NativeButton>
        ),
        tabBarInactiveTintColor: colorPalette.textSecondary,
        tabBarActiveTintColor: colorPalette.primary,
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
            title: 'Sub Track',
            tabBarIcon: ({focused}) => {
              return focused ? <HomeFilled width={30} height={30} fill={colorPalette.primary} /> : 
              <HomeIcon width={30} height={30} fill={colorPalette.textSecondary} /> 
            },
            tabBarLabel: t('tabBar.home')
          }} 
        />
        <Tabs.Screen 
          name="add" 
          options={{tabBarButton: TabBarButton, title: 'Sub Track'}} 
          listeners={{tabPress: (e) => {
            router.push('/add');
          }}} 
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            title: 'Sub Track',
            tabBarIcon: ({focused}) => {
              return focused ? <LeaderBoardFilled width={30} height={30} fill={colorPalette.primary} /> : 
              <LeaderBoard width={30} height={30} fill={colorPalette.textSecondary} /> 
            },
            tabBarLabel: t('tabBar.categories')
          }} 
        />
    </Tabs>
  )
}

export default _layout