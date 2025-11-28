import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { colorsThemePalette } from "../constants/Colors";
import { StatusBar, useColorScheme } from "react-native";

interface ThemeContextType {
  theme: string | 'light' | 'dark';
  changeTheme: (newTheme: string, type: string) => void;
  colorPalette: typeof colorsThemePalette.light | typeof colorsThemePalette.dark;
  loadingTheme: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light' as string | 'dark' as string,
  changeTheme: (newTheme: string, type: string) => {},
  colorPalette: {} as typeof colorsThemePalette.light | typeof colorsThemePalette.dark,
  loadingTheme: true,
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');
  const [colorPalette, setColorPalette] = useState<typeof colorsThemePalette.light | typeof colorsThemePalette.dark>(
    systemColorScheme === 'dark' ? colorsThemePalette.dark : colorsThemePalette.light
  );
  const [loadingTheme, setLoadingTheme] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
        setLoadingTheme(true);
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            StatusBar.setBarStyle(storedTheme === 'light' ? 'dark-content' : 'light-content');
            setTheme(storedTheme);
            setColorPalette(storedTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
        } else {
            StatusBar.setBarStyle(systemColorScheme === 'light' ? 'dark-content' : 'light-content');
            const systemTheme = systemColorScheme || 'light';
            setTheme(systemTheme);
            setColorPalette(systemTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
        }
        setLoadingTheme(false);
    };
    loadTheme();
  }, []);

  const changeTheme = async (newTheme: string, type: string) => {
    if(type === 'system') {
        StatusBar.setBarStyle(systemColorScheme === 'light' ? 'dark-content' : 'light-content');
        await AsyncStorage.removeItem('theme');
        const systemTheme = systemColorScheme || 'light';
        setTheme(systemTheme);
        setColorPalette(systemTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
    } else {
        StatusBar.setBarStyle(newTheme === 'light' ? 'dark-content' : 'light-content');
        if(newTheme !== 'light' && newTheme !== 'dark') return;
        await AsyncStorage.setItem('theme', newTheme);
        setTheme(newTheme);
        setColorPalette(newTheme === 'light' ? colorsThemePalette.light : colorsThemePalette.dark);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, colorPalette, loadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;