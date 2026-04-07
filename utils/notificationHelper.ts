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

    // Calcola la prossima data di addebito a partire dalla data selezionata
    const today = new Date();
    const billingDate = new Date(sub.firstBillingDate);
    let nextBillingDate = new Date(billingDate);

    while (nextBillingDate <= today) {
        if (sub.billingCycle === 'monthly') {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        } else {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }
    }

    // Notifica N giorni prima della prossima data di addebito
    const triggerDate = new Date(nextBillingDate);
    triggerDate.setDate(triggerDate.getDate() - sub.reminderDaysBefore);
    triggerDate.setHours(9, 0, 0, 0);

    let triggerMonthly: Notifications.MonthlyTriggerInput | undefined;
    let triggerYearly: Notifications.YearlyTriggerInput | undefined;
    let triggerDay = triggerDate.getDate();
    if (sub.billingCycle === 'monthly') {
        if (triggerDay < 1) triggerDay = 1;
        if (triggerDay > 28) triggerDay = 28;
    }
    if(sub.billingCycle === 'monthly') {
        triggerMonthly = {
            type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
            day: triggerDay,
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
        };
    } else {
        triggerYearly = {
            type: Notifications.SchedulableTriggerInputTypes.YEARLY,
            month: triggerDate.getMonth() + 1,
            day: triggerDate.getDate(),
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
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
            trigger: (sub.billingCycle === 'monthly' ? triggerMonthly : triggerYearly)!,
        });
        return notificationId;
    } catch (error) {
        console.error("Failed to schedule notification:", error);
    }
}