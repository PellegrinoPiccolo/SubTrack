import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { SubscriptionType } from "../types/SubscriptionType";
import { scheduleNotification } from "../utils/notificationHelper";
import * as Notifications from 'expo-notifications';
import { LabelsType } from "../types/LabelsType";

interface SubsContextType {
  subs: SubscriptionType[];
  addSub: (sub: SubscriptionType) => void;
  removeSub: (sub: string) => void;
  modifySub: (sub: SubscriptionType) => void;
  loadingSubs: boolean;
  createLabel?: (label: LabelsType) => void;
  deleteLabel?: (labelId: string) => void;
  labels?: LabelsType[];
  addLabelToSub?: (subId: string, labelId: string) => void;
  removeLabelFromSub?: (subId: string, labelId: string) => void;
}

export const SubsContext = createContext<SubsContextType>({
  subs: [] as SubscriptionType[],
  addSub: (sub: SubscriptionType) => {},
  removeSub: (sub: string) => {},
  modifySub: (sub: SubscriptionType) => {},
  loadingSubs: true,
  createLabel: (label: LabelsType) => {},
  deleteLabel: (labelId: string) => {},
  labels: [] as LabelsType[],
  addLabelToSub: (subId: string, labelId: string) => {},
  removeLabelFromSub: (subId: string, labelId: string) => {},
});

const SubsProvider = ({ children }: { children: React.ReactNode }) => {
  const [subs, setSubs] = useState<SubscriptionType[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [labels, setLabels] = useState<LabelsType[]>([]);

  const loadSubs = async () => {
    const storedSubs = await AsyncStorage.getItem('subscriptions');
    const storedLabels = await AsyncStorage.getItem('labels');
    if (storedSubs) {
      setSubs(JSON.parse(storedSubs));
      setLabels(storedLabels ? JSON.parse(storedLabels) : []);
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

  const modifySub = async (modifiedSub: SubscriptionType) => {
    const newNotificationId = await scheduleNotification(modifiedSub);
    const updatedSub = { ...modifiedSub, notificationId: newNotificationId };
    const oldSubs = await AsyncStorage.getItem('subscriptions');
    if(oldSubs) {
      const parsedOldSubs = JSON.parse(oldSubs) as SubscriptionType[];
      await Notifications.cancelScheduledNotificationAsync(parsedOldSubs.find((s) => s.id === modifiedSub.id)?.notificationId || '');
      const updatedSubs = parsedOldSubs.map((s) => s.id === modifiedSub.id ? updatedSub : s);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
      setSubs(updatedSubs);
    }
    setSubs((prevSubs) => prevSubs.map((s) => s.id === modifiedSub.id ? updatedSub : s));
  }

  const createLabel = async (label: LabelsType) => {
    const oldLabels = await AsyncStorage.getItem('labels');
    if(oldLabels) {
      const parsedOldLabels = JSON.parse(oldLabels) as LabelsType[];
      parsedOldLabels.push(label);
      setLabels(parsedOldLabels);
      await AsyncStorage.setItem('labels', JSON.stringify(parsedOldLabels));
    } else {
      await AsyncStorage.setItem('labels', JSON.stringify([label]));
      setLabels([label]);
    }
  };

  const deleteLabel = async (labelId: string) => {
    const oldLabels = await AsyncStorage.getItem('labels');
    if(oldLabels) {
      for(const sub of subs) {
        if(sub.labels && sub.labels.includes(labelId)) {
          await removeLabelFromSub?.(sub.id, labelId);
        }
      }
      const parsedOldLabels = JSON.parse(oldLabels) as LabelsType[];
      const updatedLabels = parsedOldLabels.filter((l) => l.id !== labelId);
      await AsyncStorage.setItem('labels', JSON.stringify(updatedLabels));
      setLabels(updatedLabels);
    }
  };

  const addLabelToSub = async (subId: string, labelId: string) => {
    const subToUpdate = subs.find((s) => s.id === subId);
    if(subToUpdate) {
      const updatedSub = { ...subToUpdate, labels: [...(subToUpdate.labels || []), labelId] };
      await modifySub(updatedSub);
    }
  };

  const removeLabelFromSub = async (subId: string, labelId: string) => {
    const subToUpdate = subs.find((s) => s.id === subId);
    if(subToUpdate && subToUpdate.labels) {
      const updatedSub = { ...subToUpdate, labels: subToUpdate.labels.filter((l) => l !== labelId) };
      await modifySub(updatedSub);
    }
  };

  return (
    <SubsContext.Provider value={{ subs, addSub, removeSub, modifySub, loadingSubs, labels, createLabel, deleteLabel, addLabelToSub, removeLabelFromSub }}>
      {children}
    </SubsContext.Provider>
  );
}

export default SubsProvider;