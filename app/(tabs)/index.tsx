import React from 'react'
import { Text, View } from 'react-native'
import useTheme from '../../hook/ThemeHook';
import useSubs from '../../hook/SubsHook';
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import AttachMoney from '../../assets/icons/attach_money.svg';
import BarChart from '../../assets/icons/bar_chart.svg';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { getLocales } from 'expo-localization';
import { SubscriptionType } from '../../types/SubscriptionType';
import CurrencyExchange from '../../assets/icons/currency_exchange.svg';
import CalendarToday from '../../assets/icons/calendar_today.svg';

const Home = () => {

  const {colorPalette} = useTheme();
  const {subs} = useSubs();

  const {t} = useTranslation();

  const calculateMonthlyPrice = (subs: SubscriptionType[]) => {
    return subs.reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') {
        return total + (Number(sub.price) || 0);
      } else if (sub.billingCycle === 'yearly') {
        return total + ((Number(sub.price) || 0) / 12);
      }
      return total;
    }, 0);
  }

  const calculateYearlyPrice = (subs: SubscriptionType[]) => {
    return subs.reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') {
        return total + ((Number(sub.price) || 0) * 12);
      } else if (sub.billingCycle === 'yearly') {
        return total + (Number(sub.price) || 0);
      }
      return total;
    }, 0);
  }

  const ListEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colorPalette.textSecondary, fontSize: 24, textAlign: 'center', fontWeight: 'bold' }}>
          {t('home.noSubscriptionsTitle', 'No subscriptions yet')}
        </Text>
        <Text style={{ color: colorPalette.textSecondary, fontSize: 16, textAlign: 'center', marginTop: 10 }}>
          {t('home.noSubscriptionsMessage', 'Start tracking your recurring expenses by adding your first subscription. Never miss a renewal again!')}
        </Text>
        <View style={{ 
          borderWidth: 1, 
          borderColor: colorPalette.border, 
          marginTop: 30, 
          padding: 10, 
          borderRadius: 10, 
          flexDirection: 'row', 
          alignItems: 'flex-start', 
          width: '100%',
          shadowColor: colorPalette.primary,
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 15,
          backgroundColor: colorPalette.backgroundSecondary,
        }}>
          <View style={{
              backgroundColor: colorPalette.primary, 
              padding: 10, borderRadius: 10, 
              borderWidth: 1, 
              borderColor: colorPalette.primary, 
              justifyContent: 'center', 
              alignItems: 'center',
            }}>
            <AttachMoney width={25} height={25} fill='white' />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text style={{ color: colorPalette.text, fontSize: 14, marginLeft: 10, fontWeight: 'bold' }}>
              {t('home.trackSpending', 'Track Spending')}
            </Text>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginLeft: 10, width: 250 }}>
              {t('home.trackSpendingMessage', 'Monitor your subscription expenses in one place.')}
            </Text>
          </View>
        </View>
        <View style={{ 
          borderWidth: 1, 
          borderColor: colorPalette.border, 
          marginTop: 20, 
          padding: 10, 
          borderRadius: 10, 
          flexDirection: 'row', 
          alignItems: 'flex-start', 
          width: '100%',
          shadowColor: colorPalette.secondary,
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 15,
          backgroundColor: colorPalette.backgroundSecondary,
        }}>
          <View style={{backgroundColor: colorPalette.secondary, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colorPalette.secondary, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name="notifications-outline" size={23} color='white' />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text style={{ color: colorPalette.text, fontSize: 14, marginLeft: 10, fontWeight: 'bold' }}>
              {t('home.getReminders', 'Get Reminders')}
            </Text>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginLeft: 10, width: 250 }}>
              {t('home.getRemindersMessage', 'Never miss a billing date with our helpful reminders.')}
            </Text>
          </View>
        </View>
        <View style={{ 
          borderWidth: 1, 
          borderColor: colorPalette.border, 
          marginTop: 20, 
          padding: 10, 
          borderRadius: 10, 
          flexDirection: 'row', 
          alignItems: 'flex-start', 
          width: '100%',
          shadowColor: colorPalette.azure,
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 15,
          backgroundColor: colorPalette.backgroundSecondary,
        }}>
          <View style={{backgroundColor: colorPalette.azure, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colorPalette.azure, justifyContent: 'center', alignItems: 'center'}}>
            <BarChart width={25} height={25} fill='white' />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text style={{ color: colorPalette.text, fontSize: 14, marginLeft: 10, fontWeight: 'bold' }}>
              {t('home.analyzeCategories', 'Analyze Categories')}
            </Text>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginLeft: 10, width: 250 }}>
              {t('home.analyzeCategoriesMessage', 'See where you are spending the most and optimize your subscriptions.')}
            </Text>
          </View>
        </View>
        <Text style={{ color: colorPalette.textSecondary, fontSize: 14, marginLeft: 10, marginTop: 20, textAlign: 'center' }}>
          {t('home.clickToAdd', "Click the '+' button to add your first subscription.")}
        </Text>
      </View>
    )
  }

  const ListHeaderComponent = () => {
    if(subs.length === 0) {
      return null;
    }
    return (
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colorPalette.border, backgroundColor: colorPalette.background }}>
        <View style={{
          shadowColor: colorPalette.primary,
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 15,
        }}>
          <LinearGradient
            colors={[colorPalette.primary, colorPalette.secondary]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 16, borderRadius: 20 }}
          >
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 6, borderRadius: 10 }}>
                  <CurrencyExchange width={20} height={20} fill="white" />
                </View>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                  {t('home.totalMonthly', 'Total Monthly Subscriptions')}
                </Text>
              </View>
              <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 8 }}>
                {`${getLocales()[0].currencySymbol}${calculateMonthlyPrice(subs).toFixed(2)}`}
              </Text>
              <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>
                {t('home.acrossAllSubscriptions', {number: subs.length, defaultValue: 'Across all {{number}} subscriptions'})}
              </Text>
            </View>
          </LinearGradient>
        </View>
        <View style={{
          marginTop: 16, 
          backgroundColor: colorPalette.backgroundSecondary,
          paddingHorizontal: 10,
          paddingVertical: 16,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colorPalette.border,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,

          elevation: 15,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <CalendarToday width={20} height={20} fill={colorPalette.textSecondary} />
            <Text style={{ color: colorPalette.textSecondary, fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
              {t('home.totalYearly', 'Total Yearly Subscriptions')}
            </Text>
          </View>
          <Text style={{ color: colorPalette.primary, fontSize: 28, fontWeight: 'bold', marginTop: 8 }}>
            {`${getLocales()[0].currencySymbol}${calculateYearlyPrice(subs).toFixed(2)}`}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30, justifyContent: 'space-between'}}>
          <Text style={{ color: colorPalette.text, fontSize: 20, fontWeight: 'bold' }}>
            {t('home.activeSubscriptions', 'Active Subscriptions')}
          </Text>
          <Text style={{ color: colorPalette.textSecondary, fontSize: 14, marginLeft: 8 }}>
            {t('home.totalSubs', {count: subs.length, defaultValue: '({{count}} total)'})}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colorPalette.background }}>
      <FlashList
        data={subs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colorPalette.border }}>
            <Text style={{ color: colorPalette.text, fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 14 }}>{item.description}</Text>
          </View>
        )}
        // @ts-ignore: estimatedItemSize is not present in current FlashList props typings
        estimatedItemSize={100}
        contentContainerStyle={{ backgroundColor: colorPalette.background }}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        />
    </View>
  )
}

export default Home