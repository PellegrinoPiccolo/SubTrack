import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import { getLocales } from "expo-localization";

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'BRL', symbol: 'R$' },
  { code: 'INR', symbol: '₹' },
  { code: 'KRW', symbol: '₩' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CHF', symbol: 'Fr' },
  { code: 'CNY', symbol: '¥' },
  { code: 'PLN', symbol: 'zł' },
  { code: 'SEK', symbol: 'kr' },
  { code: 'RUB', symbol: '₽' },
  { code: 'TRY', symbol: '₺' },
];

const getLocaleCurrencyCode = () => {
  const code = getLocales()[0].currencyCode ?? 'USD';
  return CURRENCIES.find(c => c.code === code) ? code : 'USD';
};

const getLocaleCurrencySymbol = (code: string) => {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? getLocales()[0].currencySymbol ?? '$';
};

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  setCurrency: (code: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextType>({
  currencyCode: getLocaleCurrencyCode(),
  currencySymbol: getLocaleCurrencySymbol(getLocaleCurrencyCode()),
  setCurrency: () => {},
});

const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState(getLocaleCurrencyCode());

  useEffect(() => {
    AsyncStorage.getItem('currency').then((saved) => {
      if (saved && CURRENCIES.find(c => c.code === saved)) {
        setCurrencyCode(saved);
      }
    });
  }, []);

  const setCurrency = async (code: string) => {
    await AsyncStorage.setItem('currency', code);
    setCurrencyCode(code);
  };

  const currencySymbol = getLocaleCurrencySymbol(currencyCode);

  return (
    <CurrencyContext.Provider value={{ currencyCode, currencySymbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
