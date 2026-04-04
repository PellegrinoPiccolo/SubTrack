import React, { useMemo, useState } from 'react'
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native'
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
import { ImageForCategory } from '../../constants/ImageForCategory';
import { useRouter } from 'expo-router';

const Home = () => {

  const {colorPalette} = useTheme();
  const {subs, labels} = useSubs();
  const {t} = useTranslation();
  const router = useRouter();

  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const filteredSubs = activeLabel
    ? subs.filter((sub) => sub.labels?.includes(activeLabel))
    : subs;

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

  const calcDifferenceByToday = (sub: SubscriptionType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    const firstBillingDate = new Date(sub.firstBillingDate);
    firstBillingDate.setHours(0, 0, 0, 0); // Normalize to midnight
    let nextBillingDate = new Date(firstBillingDate);
    nextBillingDate.setHours(0, 0, 0, 0); // Normalize to midnight
    // Adjust next billing date to be in the future
    while (nextBillingDate <= today) {
      if (sub.billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (sub.billingCycle === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
    }
    const differenceOfDays = Math.ceil((nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return differenceOfDays === 0 ? t('home.today', 'Today') : differenceOfDays === 1 ? t('home.tomorrow', 'Tomorrow') : `${differenceOfDays} ${t('home.days', 'days')}`;
  }

  const getColorByDifferenceOfDays = (sub: SubscriptionType) => {
    const diff = calcDifferenceByToday(sub);
    if (diff === t('home.today', 'Today') || diff === t('home.tomorrow', 'Tomorrow')) {
      return colorPalette.red;
    } else {
      const days = parseInt(diff.split(' ')[0]);
      if (days <= 7) {
        return colorPalette.orange;
      } else {
        return colorPalette.secondary;
      }
    }
  }

  const sortByDifferenceByToday = (a: SubscriptionType, b: SubscriptionType) => {
    const diffA = calcDifferenceByToday(a);
    const diffB = calcDifferenceByToday(b);

    const daysA = diffA === t('home.today', 'Today') ? 0 : diffA === t('home.tomorrow', 'Tomorrow') ? 1 : parseInt(diffA.split(' ')[0]);
    const daysB = diffB === t('home.today', 'Today') ? 0 : diffB === t('home.tomorrow', 'Tomorrow') ? 1 : parseInt(diffB.split(' ')[0]);

    return daysA - daysB;
  }

  const navigateToSub = (sub: SubscriptionType) => {
    router.push({
      pathname: '/viewSub',
      params: { sub: JSON.stringify(sub) },
    });
  }

  const ListEmptyComponent = () => {
    if (activeLabel !== null) {
      const label = labels?.find((l) => l.id === activeLabel);
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: (label?.color ?? colorPalette.primary) + '22', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: label?.color ?? colorPalette.primary }} />
          </View>
          <Text style={{ color: colorPalette.text, fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
            {t('label.noResults', { name: label?.name ?? '' })}
          </Text>
          <Pressable onPress={() => setActiveLabel(null)}>
            <Text style={{ color: colorPalette.primary, fontSize: 14 }}>{t('label.clearFilter')}</Text>
          </Pressable>
        </View>
      );
    }
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

  const ListHeaderComponent = useMemo(() => {
    if(subs.length === 0) {
      return null;
    }
    return (
      <View style={{ padding: 16, backgroundColor: colorPalette.background }}>
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

        {labels && labels.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14 }}
            contentContainerStyle={{ gap: 8, paddingRight: 4 }}
          >
            <Pressable
              onPress={() => setActiveLabel(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: activeLabel === null ? colorPalette.primary : colorPalette.border,
                backgroundColor: activeLabel === null ? colorPalette.primary + '22' : colorPalette.backgroundSecondary,
              }}
            >
              <Text style={{ color: activeLabel === null ? colorPalette.primary : colorPalette.textSecondary, fontSize: 13, fontWeight: '600' }}>
                {t('label.all')}
              </Text>
            </Pressable>

            {labels.map((label) => {
              const isActive = activeLabel === label.id;
              return (
                <Pressable
                  key={label.id}
                  onPress={() => setActiveLabel(isActive ? null : label.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 20,
                    borderWidth: 1.5,
                    borderColor: isActive ? label.color : colorPalette.border,
                    backgroundColor: isActive ? label.color + '22' : colorPalette.backgroundSecondary,
                  }}
                >
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: label.color }} />
                  <Text style={{ color: isActive ? label.color : colorPalette.textSecondary, fontSize: 13, fontWeight: '600' }}>
                    {label.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    )
  }, [subs, labels, activeLabel, colorPalette, t])

  const SubComponent = ({sub}: {sub: SubscriptionType}) => {
    return (
      <Pressable onPress={() => navigateToSub(sub)} style={{ padding: 16, marginBottom: 10, borderColor: colorPalette.border, borderWidth: 1, backgroundColor: colorPalette.backgroundSecondary, marginHorizontal: 16, borderRadius: 10 }}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10}}>
          <View style={{
            backgroundColor: colorPalette.primary + '20', 
            padding: 10, 
            borderRadius: 10,
            marginRight: 10,
          }}>
            <Image source={ImageForCategory[sub.category]} style={{ width: 34, height: 34}} />
          </View>
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'flex-start'}}>
              <Text style={{ color: colorPalette.text, fontSize: 18, fontWeight: '600', width: '70%' }} numberOfLines={1} ellipsizeMode='tail'>{sub.name}</Text>
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Text style={{ color: colorPalette.text, fontSize: 18, marginTop: 4 }}>
                  {`${getLocales()[0].currencySymbol}${sub.price}`}
                </Text>
                <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginTop: 4 }}>
                  /{sub.billingCycle === 'monthly' ? t('home.monthly', 'Monthly') : t('home.yearly', 'Yearly')}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', marginTop: 10 }}>
              {sub.category && (
                <View style={{ 
                  backgroundColor: colorPalette.primary + '20', 
                  paddingHorizontal: 8, 
                  paddingVertical: 4, 
                  borderRadius: 10, 
                  alignSelf: 'flex-start',
                  marginBottom: 5,
                }}>
                  <Text style={{ color: colorPalette.primary, fontSize: 12 }}>
                    {t(`categories.${sub.category}`, sub.category)}
                  </Text>
                </View>
              )}
              {sub.firstBillingDate && (
                <View style={{ 
                  backgroundColor: getColorByDifferenceOfDays(sub) + '20', 
                  paddingHorizontal: 8, 
                  paddingVertical: 4, 
                  borderRadius: 10, 
                  alignSelf: 'flex-start',
                  marginBottom: 5,
                }}>
                  <Text style={{ color: getColorByDifferenceOfDays(sub), fontSize: 12 }}>
                    {t('home.nextBilling', 'Next billing: {{date}}', {date: calcDifferenceByToday(sub)})}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    )
  }

  const ListFooterComponent = () => {
    return (
      <View style={{ 
        padding: 20, 
        backgroundColor: colorPalette.background,
        alignItems: 'center',
        marginTop: 20,
      }}>
        <Pressable
          onPress={() => router.push('/credits')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: colorPalette.backgroundSecondary,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colorPalette.border,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 3,
          }}
        >
          <Ionicons name="information-circle-outline" size={20} color={colorPalette.primary} />
          <Text style={{
            color: colorPalette.text,
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 8,
            marginRight: 8
          }}>
            {t('home.viewCredits', 'View Credits & Attributions')}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colorPalette.textSecondary} />
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL('https://github.com/PellegrinoPiccolo/SubTrack/blob/main/PRIVACY_POLICY.md')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginTop: 10,
            backgroundColor: colorPalette.backgroundSecondary,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colorPalette.border,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 3,
          }}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color={colorPalette.primary} />
          <Text style={{
            color: colorPalette.text,
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 8,
            marginRight: 8
          }}>
            {t('home.viewPrivacyPolicy', 'Privacy Policy')}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colorPalette.textSecondary} />
        </Pressable>
        
        <Text style={{ 
          color: colorPalette.textSecondary, 
          fontSize: 12, 
          marginTop: 16,
          textAlign: 'center'
        }}>
          © {new Date().getFullYear()} SubTrack
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colorPalette.background }}>
      <FlashList
        data={filteredSubs.sort(sortByDifferenceByToday)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SubComponent sub={item} />}
        // @ts-ignore: estimatedItemSize is not present in current FlashList props typings
        estimatedItemSize={100}
        contentContainerStyle={{ backgroundColor: colorPalette.background, paddingBottom: 40 }}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
        />
    </View>
  )
}

export default Home