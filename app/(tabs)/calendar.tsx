import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import useTheme from '../../hook/ThemeHook'
import useSubs from '../../hook/SubsHook'
import useCurrency from '../../hook/CurrencyHook'
import SubIcon from '../../components/SubIcon'
import { SubscriptionType } from '../../types/SubscriptionType'

const SCREEN_WIDTH = Dimensions.get('window').width
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 32 - 12) / 7) // 16px horizontal padding each side, 6 gaps of 2px

// Returns the list of subscriptions that renew on a given day/month/year
function getSubsForDate(
  subs: SubscriptionType[],
  day: number,
  month: number,
  year: number
): SubscriptionType[] {
  const target = new Date(year, month, day)
  target.setHours(0, 0, 0, 0)

  return subs.filter((sub) => {
    const first = new Date(sub.firstBillingDate)
    first.setHours(0, 0, 0, 0)

    if (sub.billingCycle === 'monthly') {
      return first.getDate() === day && target >= first
    }
    if (sub.billingCycle === 'yearly') {
      return (
        first.getMonth() === month &&
        first.getDate() === day &&
        year >= first.getFullYear()
      )
    }
    return false
  })
}

// Build a map: day number -> subscriptions renewing that day (for a given month/year)
function buildMonthMap(
  subs: SubscriptionType[],
  month: number,
  year: number
): Map<number, SubscriptionType[]> {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const map = new Map<number, SubscriptionType[]>()
  for (let d = 1; d <= daysInMonth; d++) {
    const list = getSubsForDate(subs, d, month, year)
    if (list.length > 0) map.set(d, list)
  }
  return map
}

const Calendar = () => {
  const { colorPalette } = useTheme()
  const { subs } = useSubs()
  const { currencySymbol } = useCurrency()
  const { t, i18n } = useTranslation()
  const router = useRouter()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [displayYear, setDisplayYear] = useState(today.getFullYear())
  const [displayMonth, setDisplayMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate()
  )

  const monthMap = useMemo(
    () => buildMonthMap(subs, displayMonth, displayYear),
    [subs, displayMonth, displayYear]
  )

  const selectedSubs = useMemo(() => {
    if (selectedDay === null) return []
    return getSubsForDate(subs, selectedDay, displayMonth, displayYear)
  }, [subs, selectedDay, displayMonth, displayYear])

  const totalSelectedCost = useMemo(() => {
    return selectedSubs.reduce((sum, sub) => sum + (Number(sub.price) || 0), 0)
  }, [selectedSubs])

  // Calendar grid helpers
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay()
  // Convert Sunday=0 to Monday-first offset (0=Mon, …, 6=Sun)
  const startOffset = (firstDayOfMonth + 6) % 7

  const calendarCells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) calendarCells.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const weekRows: (number | null)[][] = []
  for (let i = 0; i < calendarCells.length; i += 7) {
    weekRows.push(calendarCells.slice(i, i + 7))
  }

  // Weekday header labels (Mon-first)
  const weekdayLabels = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 0].map((dow) => {
      const d = new Date(2024, 0, 7 + dow) // a week starting Mon Jan 8 2024
      return d.toLocaleDateString(i18n.language, { weekday: 'short' }).slice(0, 2)
    })
  }, [i18n.language])

  const monthLabel = useMemo(() => {
    const d = new Date(displayYear, displayMonth, 1)
    return d.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })
  }, [displayMonth, displayYear, i18n.language])

  const prevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear((y) => y - 1)
    } else {
      setDisplayMonth((m) => m - 1)
    }
    setSelectedDay(null)
  }

  const nextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear((y) => y + 1)
    } else {
      setDisplayMonth((m) => m + 1)
    }
    setSelectedDay(null)
  }

  const isCurrentMonth =
    displayMonth === today.getMonth() && displayYear === today.getFullYear()

  const goToToday = () => {
    setDisplayMonth(today.getMonth())
    setDisplayYear(today.getFullYear())
    setSelectedDay(today.getDate())
  }

  const isToday = (day: number) =>
    day === today.getDate() &&
    displayMonth === today.getMonth() &&
    displayYear === today.getFullYear()

  const navigateToSub = (sub: SubscriptionType) => {
    router.push({ pathname: '/viewSub', params: { sub: JSON.stringify(sub) } })
  }

  if (subs.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colorPalette.background,
          padding: 40,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colorPalette.primary + '22',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={40}
            color={colorPalette.primary}
          />
        </View>
        <Text
          style={{
            color: colorPalette.text,
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          {t('calendar.noData', 'No subscriptions')}
        </Text>
        <Text
          style={{
            color: colorPalette.textSecondary,
            fontSize: 15,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {t(
            'calendar.noDataMessage',
            'Add subscriptions to see their renewal dates on the calendar.'
          )}
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
      {/* Header gradient */}
      <View style={{ padding: 16 }}>
        <View
          style={{
            shadowColor: colorPalette.primary,
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.35,
            shadowRadius: 9.51,
            elevation: 15,
          }}
        >
          <LinearGradient
            colors={colorPalette.gradientColors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20, borderRadius: 20 }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: 6,
                  borderRadius: 10,
                }}
              >
                <Ionicons name="calendar-outline" size={20} color="white" />
              </View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontWeight: '600',
                  marginLeft: 8,
                }}
              >
                {t('calendar.title', 'Renewal Calendar')}
              </Text>
            </View>
            <Text
              style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 8 }}
            >
              {t('calendar.subtitle', 'Track your subscription renewals')}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Calendar card */}
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            backgroundColor: colorPalette.backgroundSecondary,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colorPalette.border,
            padding: 16,
          }}
        >
          {/* Month navigation */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Pressable
              onPress={prevMonth}
              hitSlop={12}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colorPalette.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={colorPalette.text}
              />
            </Pressable>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: colorPalette.text,
                fontSize: 17,
                fontWeight: '700',
                textTransform: 'capitalize',
              }}
            >
              {monthLabel}
            </Text>
            <Pressable
              onPress={nextMonth}
              hitSlop={12}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colorPalette.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colorPalette.text}
              />
            </Pressable>
          </View>

          {/* Today button — visible only when not on current month */}
          {!isCurrentMonth && (
            <Pressable
              onPress={goToToday}
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: colorPalette.primary + '18',
                marginTop: 0,
                marginBottom: 12,
              }}
            >
              <Ionicons name="today-outline" size={14} color={colorPalette.primary} />
              <Text style={{ color: colorPalette.primary, fontSize: 13, fontWeight: '600' }}>
                {t('calendar.today', 'Today')}
              </Text>
            </Pressable>
          )}

          {/* Weekday headers */}
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {weekdayLabels.map((label, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    color: i >= 5 ? colorPalette.primary : colorPalette.textSecondary,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          {weekRows.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{ flexDirection: 'row', marginBottom: 4 }}
            >
              {row.map((day, colIndex) => {
                if (day === null) {
                  return <View key={colIndex} style={{ flex: 1 }} />
                }

                const renewals = monthMap.get(day) ?? []
                const hasRenewals = renewals.length > 0
                const isSelected = day === selectedDay
                const isTodayDay = isToday(day)
                const isWeekend = colIndex >= 5

                return (
                  <Pressable
                    key={colIndex}
                    onPress={() =>
                      setSelectedDay(isSelected ? null : day)
                    }
                    style={{ flex: 1, alignItems: 'center', paddingVertical: 2 }}
                  >
                    {/* Day number circle */}
                    <View
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        borderRadius: CELL_SIZE / 2,
                        overflow: 'hidden',
                        backgroundColor: isSelected
                          ? colorPalette.primary
                          : isTodayDay
                          ? colorPalette.primary + '22'
                          : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected
                            ? 'white'
                            : isTodayDay
                            ? colorPalette.primary
                            : isWeekend
                            ? colorPalette.primary
                            : colorPalette.text,
                          fontSize: 14,
                          fontWeight: isSelected || isTodayDay ? '700' : '400',
                        }}
                      >
                        {day}
                      </Text>
                    </View>

                    {/* Renewal icons */}
                    {hasRenewals && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginTop: 3,
                          height: 16,
                        }}
                      >
                        {(renewals.length > 3
                          ? renewals.slice(0, 2)
                          : renewals.slice(0, 3)
                        ).map((sub, iconIdx) => (
                          <View
                            key={iconIdx}
                            style={{
                              marginLeft: iconIdx === 0 ? 0 : -5,
                              borderWidth: 1,
                              borderColor: colorPalette.backgroundSecondary,
                              borderRadius: 5,
                            }}
                          >
                            <SubIcon
                              iconName={sub.iconName}
                              iconLibrary={sub.iconLibrary}
                              iconColor={sub.iconColor}
                              category={sub.category}
                              containerSize={16}
                              iconSize={8}
                              borderRadius={4}
                              fallbackBg={colorPalette.primary + '33'}
                            />
                          </View>
                        ))}
                        {renewals.length > 3 && (
                          <View
                            style={{
                              marginLeft: -5,
                              width: 16,
                              height: 16,
                              borderRadius: 4,
                              backgroundColor: colorPalette.border,
                              borderWidth: 1,
                              borderColor: colorPalette.backgroundSecondary,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                color: colorPalette.textSecondary,
                                fontSize: 7,
                                fontWeight: '700',
                              }}
                            >
                              +{renewals.length - 2}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </Pressable>
                )
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Selected day panel */}
      {selectedDay !== null && (
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: colorPalette.text,
                fontSize: 18,
                fontWeight: 'bold',
                flex: 1,
              }}
            >
              {new Date(displayYear, displayMonth, selectedDay).toLocaleDateString(
                undefined,
                { day: 'numeric', month: 'long' }
              )}
            </Text>
            {selectedSubs.length > 0 && (
              <View
                style={{
                  backgroundColor: colorPalette.primary + '22',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: colorPalette.primary,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {currencySymbol}
                  {totalSelectedCost.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {selectedSubs.length === 0 ? (
            <View
              style={{
                padding: 20,
                backgroundColor: colorPalette.backgroundSecondary,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colorPalette.border,
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={32}
                color={colorPalette.secondary}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  color: colorPalette.textSecondary,
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                {t('calendar.noRenewals', 'No renewals on this day')}
              </Text>
            </View>
          ) : (
            selectedSubs.map((sub) => (
              <Pressable
                key={sub.id}
                onPress={() => navigateToSub(sub)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 14,
                  marginBottom: 8,
                  backgroundColor: colorPalette.backgroundSecondary,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colorPalette.border,
                }}
              >
                <SubIcon
                  iconName={sub.iconName}
                  iconLibrary={sub.iconLibrary}
                  iconColor={sub.iconColor}
                  category={sub.category}
                  containerSize={46}
                  iconSize={22}
                  borderRadius={12}
                  fallbackBg={colorPalette.primary + '18'}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      color: colorPalette.text,
                      fontSize: 15,
                      fontWeight: '600',
                    }}
                    numberOfLines={1}
                  >
                    {sub.name}
                  </Text>
                  <Text
                    style={{
                      color: colorPalette.textSecondary,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {t(`categories.${sub.category}`, sub.category)}
                    {' · '}
                    {sub.billingCycle === 'monthly'
                      ? t('billingCycle.monthly', 'Monthly')
                      : t('billingCycle.yearly', 'Yearly')}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      color: colorPalette.text,
                      fontSize: 16,
                      fontWeight: '700',
                    }}
                  >
                    {currencySymbol}
                    {Number(sub.price).toFixed(2)}
                  </Text>
                  <View
                    style={{
                      marginTop: 4,
                      backgroundColor:
                        (sub.iconColor ?? colorPalette.primary) + '22',
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: sub.iconColor ?? colorPalette.primary,
                        fontSize: 11,
                        fontWeight: '600',
                      }}
                    >
                      {t('calendar.renewal', 'Renewal')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      )}
    </ScrollView>
  )
}

export default Calendar
