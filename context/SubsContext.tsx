import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

interface SubsContextType {
  subs: string[];
  addSub: (sub: string) => void;
  removeSub: (sub: string) => void;
  loadingSubs: boolean;
}

export const SubsContext = createContext<SubsContextType>({
  subs: [] as string[],
  addSub: (sub: string) => {},
  removeSub: (sub: string) => {},
  loadingSubs: true,
});

const SubsProvider = ({ children }: { children: React.ReactNode }) => {
  const [subs, setSubs] = useState<string[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const loadSubs = async () => {
    const storedSubs = await AsyncStorage.getItem('subscriptions');
    if (storedSubs) {
      setSubs(JSON.parse(storedSubs));
    }
    setLoadingSubs(false);
  };

  useEffect(() => {
    loadSubs();
  }, []);

  const addSub = async (sub: string) => {
    const oldSubs = await AsyncStorage.getItem('subscriptions');
    setSubs((prevSubs) => [...prevSubs, sub]);
    if(oldSubs) {
      const parsedOldSubs = JSON.parse(oldSubs) as string[];
      parsedOldSubs.push(sub);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(parsedOldSubs));
    } else {
      await AsyncStorage.setItem('subscriptions', JSON.stringify([sub]));
    }
  };

  const removeSub = async (sub: string) => {
    const oldSubs = await AsyncStorage.getItem('subscriptions');
    if(oldSubs) {
      const parsedOldSubs = JSON.parse(oldSubs) as string[];
      const updatedSubs = parsedOldSubs.filter((s) => s !== sub);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
    }
    setSubs((prevSubs) => prevSubs.filter((s) => s !== sub));
  };

  return (
    <SubsContext.Provider value={{ subs, addSub, removeSub, loadingSubs }}>
      {children}
    </SubsContext.Provider>
  );
}

export default SubsProvider;