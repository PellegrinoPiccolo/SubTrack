import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { SubscriptionType } from "../types/SubscriptionType";
import { scheduleNotification } from "../utils/notificationHelper";
import * as Notifications from 'expo-notifications';

interface SubsContextType {
  subs: SubscriptionType[];
  addSub: (sub: SubscriptionType) => void;
  removeSub: (sub: string) => void;
  loadingSubs: boolean;
}

export const SubsContext = createContext<SubsContextType>({
  subs: [] as SubscriptionType[],
  addSub: (sub: SubscriptionType) => {},
  removeSub: (sub: string) => {},
  loadingSubs: true,
});

const SubsProvider = ({ children }: { children: React.ReactNode }) => {
  const [subs, setSubs] = useState<SubscriptionType[]>([]);
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

  const addSub = async (sub: SubscriptionType) => {
    try {
      const notificationId = await scheduleNotification(sub);
      const subWithNotification = { ...sub, notificationId };
      const oldSubs = await AsyncStorage.getItem('subscriptions');
      setSubs((prevSubs) => [...prevSubs, subWithNotification]);
      if(oldSubs) {
        const parsedOldSubs = JSON.parse(oldSubs) as SubscriptionType[];
        parsedOldSubs.push(subWithNotification);
        setSubs(parsedOldSubs);
        await AsyncStorage.setItem('subscriptions', JSON.stringify(parsedOldSubs));
      } else {
        await AsyncStorage.setItem('subscriptions', JSON.stringify([subWithNotification]));
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
      throw error;
    }
  };

  const removeSub = async (sub: string) => {
    const oldSubs = await AsyncStorage.getItem('subscriptions');
    const subToRemove = subs.find((s) => s.id === sub);
    if(subToRemove && subToRemove.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(subToRemove.notificationId);
      } catch (error) {
        console.error("Failed to cancel notification:", error);
      }
    }
    if(oldSubs) {
      const parsedOldSubs = JSON.parse(oldSubs) as SubscriptionType[];
      const updatedSubs = parsedOldSubs.filter((s) => s.id !== sub);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
      setSubs(updatedSubs);
    }
    setSubs((prevSubs) => prevSubs.filter((s) => s.id !== sub));
  };

  return (
    <SubsContext.Provider value={{ subs, addSub, removeSub, loadingSubs }}>
      {children}
    </SubsContext.Provider>
  );
}

export default SubsProvider;