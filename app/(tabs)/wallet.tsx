import React, { useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import useTheme from '../../hook/ThemeHook'
import useSubs from '../../hook/SubsHook'
import useCurrency from '../../hook/CurrencyHook'
import { useTranslation } from 'react-i18next'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { SubscriptionType } from '../../types/SubscriptionType'
import SubIcon from '../../components/SubIcon'
import { useRouter } from 'expo-router'
import CurrencyExchange from '../../assets/icons/currency_exchange.svg'
import CalendarToday from '../../assets/icons/calendar_today.svg'

const Wallet = () => {
  const { colorPalette } = useTheme()
  const { subs } = useSubs()
  const { currencySymbol } = useCurrency()
  const { t } = useTranslation()
  const router = useRouter()

  const calculateMonthlyPrice = (list: SubscriptionType[]) =>
    list.reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') return total + (Number(sub.price) || 0)
      if (sub.billingCycle === 'yearly') return total + (Number(sub.price) || 0) / 12
      return total
    }, 0)

  const calculateYearlyPrice = (list: SubscriptionType[]) =>
    list.reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') return total + (Number(sub.price) || 0) * 12
      if (sub.billingCycle === 'yearly') return total + (Number(sub.price) || 0)
      return total
    }, 0)

  const getNextBillingDate = (sub: SubscriptionType): Date => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const next = new Date(sub.firstBillingDate)
    next.setHours(0, 0, 0, 0)
    while (next <= today) {
      if (sub.billingCycle === 'monthly') next.setMonth(next.getMonth() + 1)
      else next.setFullYear(next.getFullYear() + 1)
    }
    return next
  }

  const getDaysUntil = (sub: SubscriptionType): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const next = getNextBillingDate(sub)
    return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const stats = useMemo(() => {
    const monthly = calculateMonthlyPrice(subs)
    const yearly = calculateYearlyPrice(subs)
    const daily = monthly / 30

    const monthlySubs = subs.filter(s => s.billingCycle === 'monthly')
    const yearlySubs = subs.filter(s => s.billingCycle === 'yearly')

    const monthlySubsCost = monthlySubs.reduce((t, s) => t + (Number(s.price) || 0), 0)
    const yearlySubsCost = yearlySubs.reduce((t, s) => t + (Number(s.price) || 0), 0)

    const sortedByPrice = [...subs].sort((a, b) => {
      const aMonthly = a.billingCycle === 'monthly' ? Number(a.price) : Number(a.price) / 12
      const bMonthly = b.billingCycle === 'monthly' ? Number(b.price) : Number(b.price) / 12
      return bMonthly - aMonthly
    })

    const upcomingRenewals = [...subs]
      .filter(s => getDaysUntil(s) <= 30)
      .sort((a, b) => getDaysUntil(a) - getDaysUntil(b))

    return { monthly, yearly, daily, monthlySubs, yearlySubs, monthlySubsCost, yearlySubsCost, sortedByPrice, upcomingRenewals }
  }, [subs])

  const navigateToSub = (sub: SubscriptionType) => {
    router.push({ pathname: '/viewSub', params: { sub: JSON.stringify(sub) } })
  }

  const formatDays = (days: number) => {
    if (days === 0) return t('home.today', 'Today')
    if (days === 1) return t('home.tomorrow', 'Tomorrow')
    return `${days} ${t('home.days', 'days')}`
  }

  const getDayColor = (days: number) => {
    if (days <= 1) return colorPalette.red
    if (days <= 7) return colorPalette.orange
    return colorPalette.secondary
  }

  const formatDate = (sub: SubscriptionType) => {
    const d = getNextBillingDate(sub)
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
  }

  if (subs.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorPalette.background, padding: 40 }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: colorPalette.tertiary + '22',
          justifyContent: 'center', alignItems: 'center', marginBottom: 20,
        }}>
          <Ionicons name="wallet-outline" size={40} color={colorPalette.tertiary} />
        </View>
        <Text style={{ color: colorPalette.text, fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
          {t('wallet.noData', 'Nessun abbonamento')}
        </Text>
        <Text style={{ color: colorPalette.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
          {t('wallet.noDataMessage', 'Aggiungi i tuoi abbonamenti per vedere il riepilogo finanziario dettagliato.')}
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colorPalette.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header gradient card */}
      <View style={{ padding: 16 }}>
        <View style={{
          shadowColor: colorPalette.tertiary,
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.35,
          shadowRadius: 9.51,
          elevation: 15,
        }}>
          <LinearGradient
            colors={[colorPalette.tertiary, '#E05500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20, borderRadius: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 6, borderRadius: 10 }}>
                <Ionicons name="wallet-outline" size={20} color="white" />
              </View>
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '600', marginLeft: 8 }}>
                {t('wallet.overview', 'Panoramica Finanziaria')}
              </Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 12 }}>
              {t('wallet.monthlyTotal', 'Spesa Mensile Totale')}
            </Text>
            <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold', marginTop: 2 }}>
              {currencySymbol}{stats.monthly.toFixed(2)}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.25)' }}>
              <View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{t('wallet.yearly', 'Annuale')}</Text>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginTop: 2 }}>
                  {currencySymbol}{stats.yearly.toFixed(2)}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{t('wallet.daily', 'Giornaliero')}</Text>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginTop: 2 }}>
                  {currencySymbol}{stats.daily.toFixed(2)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{t('wallet.subscriptions', 'Abbonamenti')}</Text>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginTop: 2 }}>
                  {subs.length}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Billing cycle breakdown */}
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={{ color: colorPalette.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          {t('wallet.billingBreakdown', 'Suddivisione per Ciclo')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Monthly */}
          <View style={{
            flex: 1, padding: 16,
            backgroundColor: colorPalette.backgroundSecondary,
            borderRadius: 16, borderWidth: 1, borderColor: colorPalette.border,
          }}>
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: colorPalette.primary + '22',
              justifyContent: 'center', alignItems: 'center', marginBottom: 10,
            }}>
              <CurrencyExchange width={18} height={18} fill={colorPalette.primary} />
            </View>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12 }}>
              {t('wallet.monthlySubs', 'Mensili')}
            </Text>
            <Text style={{ color: colorPalette.primary, fontSize: 22, fontWeight: 'bold', marginTop: 4 }}>
              {currencySymbol}{stats.monthlySubsCost.toFixed(2)}
            </Text>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginTop: 4 }}>
              {stats.monthlySubs.length} {stats.monthlySubs.length === 1 ? t('wallet.sub', 'abbonamento') : t('wallet.subs', 'abbonamenti')}
            </Text>
          </View>

          {/* Yearly */}
          <View style={{
            flex: 1, padding: 16,
            backgroundColor: colorPalette.backgroundSecondary,
            borderRadius: 16, borderWidth: 1, borderColor: colorPalette.border,
          }}>
            <View style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: colorPalette.secondary + '22',
              justifyContent: 'center', alignItems: 'center', marginBottom: 10,
            }}>
              <CalendarToday width={18} height={18} fill={colorPalette.secondary} />
            </View>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12 }}>
              {t('wallet.yearlySubs', 'Annuali')}
            </Text>
            <Text style={{ color: colorPalette.secondary, fontSize: 22, fontWeight: 'bold', marginTop: 4 }}>
              {currencySymbol}{stats.yearlySubsCost.toFixed(2)}
            </Text>
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginTop: 4 }}>
              {stats.yearlySubs.length} {stats.yearlySubs.length === 1 ? t('wallet.sub', 'abbonamento') : t('wallet.subs', 'abbonamenti')}
            </Text>
          </View>
        </View>

        {/* Progress bar monthly vs yearly */}
        {subs.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colorPalette.border, flexDirection: 'row', overflow: 'hidden' }}>
              <View style={{
                width: `${(stats.monthlySubs.length / subs.length) * 100}%`,
                backgroundColor: colorPalette.primary,
              }} />
              <View style={{
                flex: 1,
                backgroundColor: colorPalette.secondary,
              }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ color: colorPalette.textSecondary, fontSize: 11 }}>
                {((stats.monthlySubs.length / subs.length) * 100).toFixed(0)}% {t('wallet.monthlySubs', 'Mensili')}
              </Text>
              <Text style={{ color: colorPalette.textSecondary, fontSize: 11 }}>
                {((stats.yearlySubs.length / subs.length) * 100).toFixed(0)}% {t('wallet.yearlySubs', 'Annuali')}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Upcoming renewals (next 30 days) */}
      {stats.upcomingRenewals.length > 0 && (
        <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colorPalette.text, fontSize: 18, fontWeight: 'bold', flex: 1 }}>
              {t('wallet.upcomingRenewals', 'Rinnovi Imminenti')}
            </Text>
            <View style={{
              backgroundColor: colorPalette.red + '22',
              paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
            }}>
              <Text style={{ color: colorPalette.red, fontSize: 12, fontWeight: '600' }}>
                {t('wallet.next30Days', '30 giorni')}
              </Text>
            </View>
          </View>

          {stats.upcomingRenewals.map((sub) => {
            const days = getDaysUntil(sub)
            const dayColor = getDayColor(days)
            return (
              <Pressable
                key={sub.id}
                onPress={() => navigateToSub(sub)}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  padding: 14, marginBottom: 8,
                  backgroundColor: colorPalette.backgroundSecondary,
                  borderRadius: 14, borderWidth: 1, borderColor: colorPalette.border,
                }}
              >
                {/* Date badge */}
                <View style={{
                  width: 46, height: 46, borderRadius: 12,
                  backgroundColor: dayColor + '18',
                  justifyContent: 'center', alignItems: 'center', marginRight: 12,
                }}>
                  <Text style={{ color: dayColor, fontSize: 10, fontWeight: '700' }}>
                    {formatDate(sub).split(' ')[1]?.toUpperCase()}
                  </Text>
                  <Text style={{ color: dayColor, fontSize: 18, fontWeight: 'bold', lineHeight: 20 }}>
                    {formatDate(sub).split(' ')[0]}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: colorPalette.text, fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
                    {sub.name}
                  </Text>
                  <View style={{
                    marginTop: 4, alignSelf: 'flex-start',
                    backgroundColor: dayColor + '18',
                    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8,
                  }}>
                    <Text style={{ color: dayColor, fontSize: 11, fontWeight: '600' }}>
                      {formatDays(days)}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: colorPalette.text, fontSize: 16, fontWeight: '700' }}>
                    {currencySymbol}{sub.price}
                  </Text>
                  <Text style={{ color: colorPalette.textSecondary, fontSize: 11, marginTop: 2 }}>
                    /{sub.billingCycle === 'monthly' ? t('home.monthly', 'Mensile') : t('home.yearly', 'Annuale')}
                  </Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      )}

      {/* All subscriptions sorted by cost */}
      <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
        <Text style={{ color: colorPalette.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          {t('wallet.byExpense', 'Per Costo Mensile')}
        </Text>

        {stats.sortedByPrice.map((sub, index) => {
          const monthlyEquiv = sub.billingCycle === 'monthly' ? Number(sub.price) : Number(sub.price) / 12
          const percent = stats.monthly > 0 ? (monthlyEquiv / stats.monthly) * 100 : 0

          return (
            <Pressable
              key={sub.id}
              onPress={() => navigateToSub(sub)}
              style={{
                marginBottom: 10,
                backgroundColor: colorPalette.backgroundSecondary,
                borderRadius: 14, borderWidth: 1, borderColor: colorPalette.border,
                overflow: 'hidden',
              }}
            >
              <View style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Rank */}
                  <Text style={{ color: colorPalette.textSecondary, fontSize: 13, fontWeight: '700', width: 22 }}>
                    #{index + 1}
                  </Text>

                  {/* Icon */}
                  <View style={{ marginRight: 12 }}>
                    <SubIcon
                      iconName={sub.iconName}
                      iconLibrary={sub.iconLibrary}
                      iconColor={sub.iconColor}
                      category={sub.category}
                      containerSize={44}
                      iconSize={22}
                      borderRadius={10}
                      fallbackBg={colorPalette.primary + '18'}
                    />
                  </View>

                  {/* Name & category */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colorPalette.text, fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
                      {sub.name}
                    </Text>
                    <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginTop: 2 }}>
                      {t(`categories.${sub.category}`, sub.category)}
                    </Text>
                  </View>

                  {/* Price */}
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colorPalette.text, fontSize: 16, fontWeight: '700' }}>
                      {currencySymbol}{monthlyEquiv.toFixed(2)}
                    </Text>
                    <Text style={{ color: colorPalette.textSecondary, fontSize: 11, marginTop: 2 }}>
                      /{t('wallet.month', 'mese')}
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: colorPalette.border }}>
                    <View style={{
                      width: `${percent}%`,
                      height: '100%',
                      borderRadius: 3,
                      backgroundColor: index === 0 ? colorPalette.tertiary : colorPalette.primary,
                    }} />
                  </View>
                  <Text style={{ color: colorPalette.textSecondary, fontSize: 11, width: 36, textAlign: 'right' }}>
                    {percent.toFixed(0)}%
                  </Text>
                </View>
              </View>
            </Pressable>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default Wallet
