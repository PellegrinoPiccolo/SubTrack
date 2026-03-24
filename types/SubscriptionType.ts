export interface SubscriptionType {
    id: string;
    name: string;
    description?: string | null;
    price: string;
    link: string | null;
    billingCycle: 'monthly' | 'yearly';
    category: 'Entertainment' | 'Productivity' | 'Education' | 'Fittnes&Health' | 'Work' | 'Home' | 'Other';
    firstBillingDate: Date;
    reminder: boolean;
    reminderDaysBefore: number;
    notificationId?: string | null;
    labels?: string[];
}