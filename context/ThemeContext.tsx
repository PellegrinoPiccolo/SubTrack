import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { colorsThemePalette } from "../constants/Colors";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  theme: string | 'light' | 'dark';
  changeTheme: (newTheme: string, type: string) => void;
  colorPalette: typeof colorsThemePalette.light | typeof colorsThemePalette.dark;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light' as string | 'dark' as string,
  changeTheme: (newTheme: string, type: string) => {},
  colorPalette: {} as typeof colorsThemePalette.light | typeof colorsThemePalette.dark,
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');
  const [colorPalette, setColorPalette] = useState<typeof colorsThemePalette.light | typeof colorsThemePalette.dark>(
    systemColorScheme === 'dark' ? colorsThemePalette.dark : colorsThemePalette.light
  );

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const loadTheme = async () => {
        
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            setTheme(storedTheme);
            setColorPalette(storedTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
        } else {
            const systemTheme = systemColorScheme || 'light';
            setTheme(systemTheme);
            setColorPalette(systemTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
        }
        await SplashScreen.hideAsync();
    };
    loadTheme();
  }, []);

  const changeTheme = async (newTheme: string, type: string) => {
    if(type === 'system') {
        await AsyncStorage.removeItem('theme');
        const systemTheme = systemColorScheme || 'light';
        setTheme(systemTheme);
        setColorPalette(systemTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
    } else {
        if(newTheme !== 'light' && newTheme !== 'dark') return;
        await AsyncStorage.setItem('theme', newTheme);
        setTheme(newTheme);
        setColorPalette(newTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, colorPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;