import * as Notifications from 'expo-notifications';
import { SubscriptionType } from '../types/SubscriptionType';
import { getLocales } from 'expo-localization';

export async function scheduleNotification(sub: SubscriptionType) {

    if(!sub.reminder) return;

    const messages = {
        en: {
            upcomingSubscription: "Upcoming Subscription {{name}}",
            yourSubscription: "Your subscription to {{name}} ({{price}}) is renewing in {{time}} days."
        },
        it: {
            upcomingSubscription: "Rinnovo abbonamento {{name}}",
            yourSubscription: "Il tuo abbonamento a {{name}} ({{price}}) si rinnoverà tra {{time}} giorni."
        }
    }

    const settings = await Notifications.getPermissionsAsync();
    if(!settings.granted) {
        const request = await Notifications.requestPermissionsAsync();
        if(!request.granted) return;
    }

    const triggerDate = new Date(sub.firstBillingDate);
    triggerDate.setDate(triggerDate.getDate() - sub.reminderDaysBefore);

    triggerDate.setHours(9, 0, 0); // Set notification time to 9:00 AM

    let trigger: Notifications.CalendarTriggerInput;

    if(sub.billingCycle === 'monthly') {
        trigger = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            day: triggerDate.getDate(),
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: true,
        };
    } else {
        trigger = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            month: triggerDate.getMonth() + 1,
            day: triggerDate.getDate(),
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: true,
        };
    }

    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: messages[getLocales()[0].languageCode as 'en' | 'it']?.upcomingSubscription.replace('{{name}}', sub.name) || messages['en'].upcomingSubscription.replace('{{name}}', sub.name),
                body: messages[getLocales()[0].languageCode as 'en' | 'it']?.yourSubscription
                    .replace('{{name}}', sub.name)
                    .replace('{{price}}', sub.price)
                    .replace('{{time}}', sub.reminderDaysBefore.toString()) ||
                    messages['en'].yourSubscription
                    .replace('{{name}}', sub.name)
                    .replace('{{price}}', sub.price)
                    .replace('{{time}}', sub.reminderDaysBefore.toString()),
                data: { subId: sub.id },
            },
            trigger,
        });
        return notificationId;
    } catch (error) {
        console.error("Failed to schedule notification:", error);
    }
}