export interface SubscriptionType {
    id: string;
    name: string;
    description?: string | null;
    price: string;
    link: string | null;
    billingCycle: 'weekly' | 'monthly' | 'yearly';
    billingCycleInterval?: number;
    category: 'Entertainment' | 'Productivity' | 'Education' | 'Fittnes&Health' | 'Work' | 'Home' | 'Other';
    firstBillingDate: Date;
    reminder: boolean;
    reminderDaysBefore: number;
    reminderHour?: number;
    reminderMinute?: number;
    notificationId?: string | null;
    labels?: string[];
}