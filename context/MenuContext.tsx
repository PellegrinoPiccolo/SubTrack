import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Dimensions, Text, TouchableWithoutFeedback, TouchableOpacity, View, BackHandler, Platform } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import useTheme from "../hook/ThemeHook";
import useCurrency from "../hook/CurrencyHook";
import { CURRENCIES } from "./CurrencyContext";
import WbSun from "../assets/icons/wb_sunny.svg";
import BedTime from "../assets/icons/bedtime.svg";

export const MenuContext = createContext({
  isMenuOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
});

const PANEL_WIDTH = Dimensions.get("window").width * 0.8;
const DURATION = 280;

const LANGUAGES = [
  { code: "en-US", label: "EN" },
  { code: "it-IT", label: "IT" },
  { code: "es-ES", label: "ES" },
  { code: "de-DE", label: "DE" },
  { code: "fr-FR", label: "FR" },
];

const MenuProvider = ({ children }: { children: ReactNode }) => {
  const { colorPalette, theme, changeTheme } = useTheme();
  const { t } = useTranslation();
  const { currencyCode, setCurrency } = useCurrency();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const panelTranslateX = useSharedValue(PANEL_WIDTH);
  const backdropOpacity = useSharedValue(0);

  const openMenu = () => {
    setIsMenuOpen(true);
    panelTranslateX.value = withTiming(0, { duration: DURATION });
    backdropOpacity.value = withTiming(1, { duration: DURATION });
  }; 

  const closeMenu = () => {
    panelTranslateX.value = withTiming(PANEL_WIDTH, { duration: DURATION });
    backdropOpacity.value = withTiming(0, { duration: DURATION }, (finished) => {
        if (finished) scheduleOnRN(setIsMenuOpen, false);
    });
  }

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: panelTranslateX.value }],
  }));
  
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  useEffect(() => {
    if(!isMenuOpen || Platform.OS !== 'android') return
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        closeMenu()
        return true
    })
    return () => subscription.remove()
  }, [isMenuOpen])

  return (
    <MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu }}>
      {children}
      {isMenuOpen && (
        <>
        <TouchableWithoutFeedback onPress={closeMenu}>
            <Animated.View style={[ 
                backdropStyle,
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }]}
            />
        </TouchableWithoutFeedback>
        <Animated.View style={[
            panelStyle,
            {
                position: 'absolute',
                top: 0,
                right: 0,
                width: PANEL_WIDTH,
                height: '100%',
                paddingHorizontal: 20,
                paddingTop: 60,
                backgroundColor: colorPalette.background,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                borderLeftWidth: 1,
                borderColor: colorPalette.border,
            }]}
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 24 }}>
                <TouchableOpacity onPress={closeMenu} style={{ padding: 6, borderRadius: 8, backgroundColor: colorPalette.backgroundSecondary }}>
                    <Text style={{ fontSize: 18, color: colorPalette.textSecondary, lineHeight: 18 }}>✕</Text>
                </TouchableOpacity>
            </View>

            {/* Appearance */}
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 10 }}>
                {t('menu.appearance').toUpperCase()}
            </Text>
            <View style={{ flexDirection: 'row', backgroundColor: colorPalette.backgroundSecondary, borderRadius: 12, padding: 4, marginBottom: 28 }}>
                {(['light', 'dark', 'system'] as const).map((option) => {
                    const isActive = theme === option || (option === 'system' && theme !== 'light' && theme !== 'dark');
                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => changeTheme(option, option === 'system' ? 'system' : 'manual')}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                paddingVertical: 8,
                                borderRadius: 9,
                                backgroundColor: isActive ? colorPalette.background : 'transparent',
                                shadowColor: isActive ? '#000' : 'transparent',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: isActive ? 0.1 : 0,
                                shadowRadius: 2,
                                elevation: isActive ? 2 : 0,
                            }}
                        >
                            {option === 'light' && <WbSun width={14} height={14} fill={isActive ? colorPalette.primary : colorPalette.textSecondary} />}
                            {option === 'dark' && <BedTime width={14} height={14} fill={isActive ? colorPalette.primary : colorPalette.textSecondary} />}
                            <Text style={{ fontSize: 12, fontWeight: '500', color: isActive ? colorPalette.primary : colorPalette.textSecondary }}>
                                {t(`menu.${option}`)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Language */}
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 10 }}>
                {t('menu.language').toUpperCase()}
            </Text>
            <View style={{ flexDirection: 'row', backgroundColor: colorPalette.backgroundSecondary, borderRadius: 12, padding: 4, marginBottom: 28 }}>
                {LANGUAGES.map(({ code, label }) => {
                    const isActive = currentLang === code;
                    return (
                        <TouchableOpacity
                            key={code}
                            onPress={async () => {
                                await AsyncStorage.setItem('language', code);
                                i18n.changeLanguage(code);
                                setCurrentLang(code);
                            }}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 8,
                                borderRadius: 9,
                                backgroundColor: isActive ? colorPalette.background : 'transparent',
                                shadowColor: isActive ? '#000' : 'transparent',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: isActive ? 0.1 : 0,
                                shadowRadius: 2,
                                elevation: isActive ? 2 : 0,
                            }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '500', color: isActive ? colorPalette.primary : colorPalette.textSecondary }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Currency */}
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 10 }}>
                {t('menu.currency').toUpperCase()}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {CURRENCIES.map(({ code, symbol }) => {
                    const isActive = currencyCode === code;
                    return (
                        <TouchableOpacity
                            key={code}
                            onPress={() => setCurrency(code)}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                borderRadius: 9,
                                backgroundColor: isActive ? colorPalette.primary + '20' : colorPalette.backgroundSecondary,
                                borderWidth: 1,
                                borderColor: isActive ? colorPalette.primary : colorPalette.border,
                            }}
                        >
                            <Text style={{ fontSize: 11, fontWeight: '700', color: isActive ? colorPalette.primary : colorPalette.textSecondary }}>
                                {code}
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: isActive ? colorPalette.primary : colorPalette.textSecondary }}>
                                {symbol}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Animated.View>
        </>
      )}
    </MenuContext.Provider>
  );
};

export default MenuProvider;