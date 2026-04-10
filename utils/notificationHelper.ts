import * as Notifications from 'expo-notifications';
import { SubscriptionType } from '../types/SubscriptionType';
import { getLocales } from 'expo-localization';

export async function scheduleNotification(sub: SubscriptionType) {

    if(!sub.reminder) return;

    const messages = {
        en: {
            upcomingSubscription: "Upcoming Subscription {{name}}",
            yourSubscription: "Your subscription \"{{name}}\" (${{price}}) is renewing in {{time}} days."
        },
        it: {
            upcomingSubscription: "Rinnovo abbonamento {{name}}",
            yourSubscription: "Il tuo abbonamento \"{{name}}\" (€{{price}}) si rinnoverà tra {{time}} giorni."
        }
    }

    const settings = await Notifications.getPermissionsAsync();
    if(!settings.granted) {
        const request = await Notifications.requestPermissionsAsync();
        if(!request.granted) return;
    }

    const lang = getLocales()[0].languageCode as 'en' | 'it';
    const title = messages[lang]?.upcomingSubscription.replace('{{name}}', sub.name) ?? messages['en'].upcomingSubscription.replace('{{name}}', sub.name);
    const body = (messages[lang]?.yourSubscription ?? messages['en'].yourSubscription)
        .replace('{{name}}', sub.name)
        .replace('{{price}}', sub.price)
        .replace('{{time}}', sub.reminderDaysBefore.toString());

    const hour = sub.reminderHour ?? 9;
    const minute = sub.reminderMinute ?? 0;

    try {
        let trigger: Notifications.SchedulableNotificationTriggerInput;

        const interval = sub.billingCycleInterval ?? 1;

        if (interval > 1) {
            // Custom interval (e.g. every 2 months): calculate exact next notification date
            const billingDate = new Date(sub.firstBillingDate);
            const today = new Date();
            let nextBillingDate = new Date(billingDate);
            while (nextBillingDate <= today) {
                if (sub.billingCycle === 'weekly') {
                    nextBillingDate.setDate(nextBillingDate.getDate() + 7 * interval);
                } else if (sub.billingCycle === 'monthly') {
                    nextBillingDate.setMonth(nextBillingDate.getMonth() + interval);
                } else {
                    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + interval);
                }
            }
            const triggerDate = new Date(nextBillingDate);
            triggerDate.setDate(triggerDate.getDate() - sub.reminderDaysBefore);
            triggerDate.setHours(hour, minute, 0, 0);
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            };
        } else if (sub.billingCycle === 'weekly') {
            // Calculate which day of week billing falls on, subtract reminderDaysBefore
            const billingDate = new Date(sub.firstBillingDate);
            const today = new Date();
            let nextBillingDate = new Date(billingDate);
            while (nextBillingDate <= today) {
                nextBillingDate.setDate(nextBillingDate.getDate() + 7);
            }
            // JS weekday: 0=Sunday … 6=Saturday
            // Expo WEEKLY weekday: 1=Sunday … 7=Saturday
            const billingJsWeekday = nextBillingDate.getDay();
            const notifyJsWeekday = ((billingJsWeekday - sub.reminderDaysBefore) % 7 + 7) % 7;
            const expoWeekday = notifyJsWeekday + 1; // 1=Sunday … 7=Saturday
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: expoWeekday,
                hour,
                minute,
            };
        } else if (sub.billingCycle === 'monthly') {
            // Calculate the next billing date to find which day of month to notify
            const billingDate = new Date(sub.firstBillingDate);
            const today = new Date();
            let nextBillingDate = new Date(billingDate);
            while (nextBillingDate <= today) {
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            }
            const triggerDate = new Date(nextBillingDate);
            triggerDate.setDate(triggerDate.getDate() - sub.reminderDaysBefore);
            let triggerDay = triggerDate.getDate();
            if (triggerDay < 1) triggerDay = 1;
            if (triggerDay > 28) triggerDay = 28;
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
                day: triggerDay,
                hour,
                minute,
            };
        } else {
            // yearly
            const billingDate = new Date(sub.firstBillingDate);
            const today = new Date();
            let nextBillingDate = new Date(billingDate);
            while (nextBillingDate <= today) {
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
            }
            const triggerDate = new Date(nextBillingDate);
            triggerDate.setDate(triggerDate.getDate() - sub.reminderDaysBefore);
            trigger = {
                type: Notifications.SchedulableTriggerInputTypes.YEARLY,
                month: triggerDate.getMonth() + 1,
                day: triggerDate.getDate(),
                hour,
                minute,
            };
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: { subId: sub.id },
            },
            trigger,
        });
        return notificationId;
    } catch (error) {
        console.error("Failed to schedule notification:", error);
    }
}
