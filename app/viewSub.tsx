import React, { useState } from 'react'
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { SubscriptionType } from '../types/SubscriptionType'
import useTheme from '../hook/ThemeHook';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ImageForCategory } from '../constants/ImageForCategory';
import { getLocales } from 'expo-localization';
import useCurrency from '../hook/CurrencyHook';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import useSubs from '../hook/SubsHook';
import LabelsPicker from '../components/LabelsPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SwitchButton from '../components/SwitchButton';
import { useSharedValue } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { ICON_COLORS } from '../constants/PresetSubscriptions';
import SubIcon from '../components/SubIcon';
import IconPickerModal from '../components/IconPickerModal';

const ViewSub = () => {
  const { colorPalette } = useTheme();
  const { t } = useTranslation();
  const { currencySymbol } = useCurrency();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { modifySub, removeSub, labels: allLabels } = useSubs();

  const subscription: SubscriptionType = JSON.parse(params.sub as string);

  const [isEditing, setIsEditing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Edit state
  const [name, setName] = useState(subscription.name);
  const [description, setDescription] = useState(subscription.description);
  const [price, setPrice] = useState(subscription.price);
  const [link, setLink] = useState(subscription.link);
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'yearly'>(subscription.billingCycle);
  const [billingCycleInterval, setBillingCycleInterval] = useState<number>(subscription.billingCycleInterval ?? 1);
  const [category, setCategory] = useState(subscription.category);
  const [firstBillingDate, setFirstBillingDate] = useState(new Date(subscription.firstBillingDate));
  const [reminder, setReminder] = useState(subscription.reminder);
  const isOn = useSharedValue(reminder);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(subscription.reminderDaysBefore);
  const [reminderTime, setReminderTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(subscription.reminderHour ?? 9, subscription.reminderMinute ?? 0, 0, 0);
    return d;
  });
  const [selectedLabels, setSelectedLabels] = useState<string[]>(subscription.labels || []);
  const [iconName, setIconName] = useState<string | null>(subscription.iconName || null);
  const [iconLibrary, setIconLibrary] = useState<string | null>(subscription.iconLibrary || null);
  const [iconColor, setIconColor] = useState<string>(subscription.iconColor || ICON_COLORS[7]);

  const localDevice = getLocales()[0].languageCode;

  const calcNextBillingDate = () => {
    const today = new Date();
    const firstBilling = new Date(subscription.firstBillingDate);
    let nextBilling = new Date(firstBilling);
    const interval = subscription.billingCycleInterval ?? 1;

    while (nextBilling < today) {
      if (subscription.billingCycle === 'weekly') {
        nextBilling.setDate(nextBilling.getDate() + 7 * interval);
      } else if (subscription.billingCycle === 'monthly') {
        nextBilling.setMonth(nextBilling.getMonth() + interval);
      } else {
        nextBilling.setFullYear(nextBilling.getFullYear() + interval);
      }
    }

    return nextBilling.toLocaleDateString(localDevice || 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSave = () => {
    if (name.trim() === '' || price.trim() === '') {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);

    const updatedSub: SubscriptionType = {
      ...subscription,
      name,
      description,
      price,
      link,
      billingCycle,
      billingCycleInterval,
      category,
      firstBillingDate,
      reminder,
      reminderDaysBefore,
      reminderHour: reminderTime.getHours(),
      reminderMinute: reminderTime.getMinutes(),
      labels: selectedLabels,
      iconName,
      iconLibrary: iconLibrary as 'Ionicons' | 'MaterialCommunityIcons' | null,
      iconColor,
    };

    modifySub(updatedSub);
    router.back();
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeSub(subscription.id);
    setShowDeleteModal(false);
    router.back();
  };

  const handleCancel = () => {
    setName(subscription.name);
    setDescription(subscription.description);
    setPrice(subscription.price);
    setLink(subscription.link);
    setBillingCycle(subscription.billingCycle);
    setBillingCycleInterval(subscription.billingCycleInterval ?? 1);
    setCategory(subscription.category);
    setFirstBillingDate(new Date(subscription.firstBillingDate));
    setReminder(subscription.reminder);
    isOn.value = subscription.reminder;
    setReminderDaysBefore(subscription.reminderDaysBefore);
    const resetTime = new Date();
    resetTime.setHours(subscription.reminderHour ?? 9, subscription.reminderMinute ?? 0, 0, 0);
    setReminderTime(resetTime);
    setSelectedLabels(subscription.labels || []);
    setIconName(subscription.iconName || null);
    setIconLibrary(subscription.iconLibrary || null);
    setIconColor(subscription.iconColor || ICON_COLORS[7]);
    setShowErrors(false);
    setIsEditing(false);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.background }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colorPalette.background, borderBottomColor: colorPalette.border }]}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={colorPalette.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colorPalette.text }]}>
            {isEditing ? t('viewSub.editSubscription') : t('viewSub.viewSubscription')}
          </Text>
          {!isEditing ? (
            <Pressable onPress={() => setIsEditing(true)} style={styles.headerButton}>
              <Ionicons name="create-outline" size={24} color={colorPalette.primary} />
            </Pressable>
          ) : (
            <Pressable onPress={handleCancel} style={styles.headerButton}>
              <Ionicons name="close" size={24} color={colorPalette.text} />
            </Pressable>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {!isEditing ? (
            /* View Mode */
            <View style={styles.viewContainer}>
              {/* Subscription Icon & Name */}
              <View style={styles.iconContainer}>
                <Pressable onPress={() => setShowIconPicker(true)}>
                  {iconName ? (
                    <View style={{ position: 'relative' }}>
                      <SubIcon
                        iconName={iconName}
                        iconLibrary={iconLibrary}
                        iconColor={iconColor}
                        containerSize={100}
                        iconSize={52}
                        borderRadius={26}
                        shadow
                      />
                      <View style={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: colorPalette.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: colorPalette.background,
                      }}>
                        <Ionicons name="pencil" size={13} color="white" />
                      </View>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={[colorPalette.primary, colorPalette.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.iconGradient}
                    >
                      <View style={[styles.iconWrapper, { backgroundColor: colorPalette.background }]}>
                        <Image source={ImageForCategory[subscription.category]} style={styles.icon} />
                      </View>
                    </LinearGradient>
                  )}
                </Pressable>
              </View>

              <Text style={[styles.subscriptionName, { color: colorPalette.text }]}>{subscription.name}</Text>
              
              {subscription.description && (
                <Text style={[styles.description, { color: colorPalette.textSecondary }]}>
                  {subscription.description}
                </Text>
              )}

              {/* Price Card */}
              <View style={styles.priceCard}>
                <LinearGradient
                  colors={[colorPalette.primary, colorPalette.secondary]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.priceGradient}
                >
                  <Text style={styles.priceLabel}>{t('viewSub.price')}</Text>
                  <Text style={styles.priceAmount}>
                    {currencySymbol}{subscription.price}
                  </Text>
                  <Text style={styles.billingCycleText}>
                    {(() => {
                      const interval = subscription.billingCycleInterval ?? 1;
                      const unitKey = subscription.billingCycle === 'weekly' ? 'week' : subscription.billingCycle === 'monthly' ? 'month' : 'year';
                      const unit = interval === 1 ? t(`billingCycle.${unitKey}Singular`) : t(`billingCycle.${unitKey}Plural`);
                      return `/ ${t('addScreen.every')} ${interval} ${unit}`;
                    })()}
                  </Text>
                </LinearGradient>
              </View>

              {/* Info Cards */}
              <View style={styles.infoSection}>
                <View style={[styles.infoCard, { backgroundColor: colorPalette.backgroundSecondary, borderColor: colorPalette.border }]}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colorPalette.primary + '20' }]}>
                    <Ionicons name="calendar-outline" size={20} color={colorPalette.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colorPalette.textSecondary }]}>{t('viewSub.nextBillingDate')}</Text>
                    <Text style={[styles.infoValue, { color: colorPalette.text }]}>{calcNextBillingDate()}</Text>
                  </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colorPalette.backgroundSecondary, borderColor: colorPalette.border }]}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colorPalette.secondary + '20' }]}>
                    <Ionicons name="pricetag-outline" size={20} color={colorPalette.secondary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colorPalette.textSecondary }]}>{t('viewSub.category')}</Text>
                    <Text style={[styles.infoValue, { color: colorPalette.text }]}>
                      {t(`categories.${subscription.category}`)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colorPalette.backgroundSecondary, borderColor: colorPalette.border }]}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colorPalette.azure + '20' }]}>
                    <Ionicons name="notifications-outline" size={20} color={colorPalette.azure} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colorPalette.textSecondary }]}>{t('viewSub.reminder')}</Text>
                    <Text style={[styles.infoValue, { color: colorPalette.text }]}>
                      {subscription.reminder
                        ? `${subscription.reminderDaysBefore} ${subscription.reminderDaysBefore === 1 ? t('viewSub.dayBefore') : t('viewSub.daysBefore')} • ${String(subscription.reminderHour ?? 9).padStart(2, '0')}:${String(subscription.reminderMinute ?? 0).padStart(2, '0')}`
                        : t('viewSub.noReminderSet')}
                    </Text>
                  </View>
                </View>

                {subscription.link && (
                  <View style={[styles.infoCard, { backgroundColor: colorPalette.backgroundSecondary, borderColor: colorPalette.border }]}>
                    <View style={[styles.infoIconContainer, { backgroundColor: colorPalette.primary + '20' }]}>
                      <Ionicons name="link-outline" size={20} color={colorPalette.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colorPalette.textSecondary }]}>{t('viewSub.link')}</Text>
                      <Pressable onPress={() => {
                        let url = subscription.link || '';
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                          url = 'https://' + url;
                        }
                        Linking.openURL(url);
                      }}>
                        <Text style={[styles.infoValue, { color: colorPalette.primary }]} numberOfLines={1}>
                          {subscription.link}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>

              {/* Labels */}
              {(subscription.labels ?? []).length > 0 && (
                <View style={{ marginTop: 24 }}>
                  <Text style={[styles.infoLabel, { color: colorPalette.textSecondary, marginBottom: 10 }]}>
                    {t('label.add')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {(subscription.labels ?? []).map((labelId) => {
                      const label = allLabels?.find((l) => l.id === labelId);
                      if (!label) return null;
                      return (
                        <View
                          key={label.id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            backgroundColor: label.color + '22',
                            borderWidth: 1.5,
                            borderColor: label.color,
                          }}
                        >
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: label.color }} />
                          <Text style={{ color: colorPalette.text, fontSize: 14 }}>{label.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Delete Button */}
              <Pressable
                onPress={() => setShowDeleteModal(true)}
                style={[styles.deleteButton, { backgroundColor: colorPalette.red + '20', borderColor: colorPalette.red }]}
              >
                <Ionicons name="trash-outline" size={20} color={colorPalette.red} />
                <Text style={[styles.deleteButtonText, { color: colorPalette.red }]}>{t('viewSub.deleteSubscription')}</Text>
              </Pressable>
            </View>
          ) : (
            /* Edit Mode */
            <View style={styles.editContainer}>
              {/* Icon picker trigger (edit mode) */}
              <View style={[styles.inputContainer, { alignItems: 'center' }]}>
                <Pressable onPress={() => setShowIconPicker(true)}>
                  {iconName ? (
                    <View style={{ position: 'relative' }}>
                      <SubIcon
                        iconName={iconName}
                        iconLibrary={iconLibrary}
                        iconColor={iconColor}
                        containerSize={80}
                        iconSize={42}
                        borderRadius={22}
                        shadow
                      />
                      <View style={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colorPalette.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: colorPalette.background,
                      }}>
                        <Ionicons name="pencil" size={12} color="white" />
                      </View>
                    </View>
                  ) : (
                    <View style={{
                      width: 80,
                      height: 80,
                      borderRadius: 22,
                      backgroundColor: colorPalette.backgroundSecondary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: colorPalette.border,
                      borderStyle: 'dashed',
                    }}>
                      <Ionicons name="add" size={32} color={colorPalette.textSecondary} />
                    </View>
                  )}
                </Pressable>
                <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginTop: 8 }}>
                  {t('selectSub.chooseIcon', 'Choose Icon')}
                </Text>
              </View>

              {/* Name */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.name')} <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary, borderWidth: 1, borderColor: showErrors && name.trim() === '' ? 'red' : 'transparent' }]}>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Netflix, Spotify, ..."
                    placeholderTextColor={colorPalette.textSecondary}
                    style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
                  />
                </View>
                {showErrors && name.trim() === '' && (
                  <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{t('addScreen.errors.requiredFields')}</Text>
                )}
              </View>

              {/* Description */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.description')}</Text>
                <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]}>
                  <TextInput
                    value={description || ''}
                    onChangeText={setDescription}
                    placeholder={t('addScreen.descriptionPlaceholder') || ''}
                    placeholderTextColor={colorPalette.textSecondary}
                    style={{ color: colorPalette.text, paddingVertical: 10, flex: 1, lineHeight: 20 }}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              {/* Price */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.price')} <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary, borderWidth: 1, borderColor: showErrors && price.trim() === '' ? 'red' : 'transparent' }]}>
                  <Text style={{ color: colorPalette.textSecondary, fontSize: 16 }}>
                    {currencySymbol}
                  </Text>
                  <TextInput
                    value={price}
                    onChangeText={(text) => setPrice(text.replace(',', '.').replace(/[^0-9,.]/g, '').replace(/(\..*)\./g, '$1'))}
                    placeholder="0.00"
                    placeholderTextColor={colorPalette.textSecondary}
                    keyboardType="decimal-pad"
                    style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
                  />
                </View>
                {showErrors && price.trim() === '' && (
                  <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{t('addScreen.errors.requiredFields')}</Text>
                )}
              </View>

              {/* Link */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.link')}</Text>
                <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]}>
                  <TextInput
                    value={link || ''}
                    onChangeText={setLink}
                    placeholder="https://"
                    placeholderTextColor={colorPalette.textSecondary}
                    style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
                  />
                </View>
              </View>

              {/* Billing Cycle */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.billingCycle')} <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={[styles.billingCycleContainer, { backgroundColor: colorPalette.backgroundSecondary }]}>
                  {(['weekly', 'monthly', 'yearly'] as const).map((cycle) => (
                    <Pressable
                      key={cycle}
                      style={[styles.billingCycleTextContainer, { backgroundColor: billingCycle === cycle ? colorPalette.primary : 'transparent' }]}
                      onPress={() => setBillingCycle(cycle)}
                    >
                      <Text style={{ color: billingCycle === cycle ? 'white' : colorPalette.textSecondary, fontSize: 15 }}>
                        {t(`billingCycle.${cycle}`)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  <Text style={{ color: colorPalette.textSecondary, fontSize: 14 }}>{t('addScreen.every')}</Text>
                  <Pressable
                    onPress={() => setBillingCycleInterval(prev => Math.max(1, prev - 1))}
                    style={{ padding: 8, backgroundColor: colorPalette.backgroundSecondary, borderRadius: 8 }}
                  >
                    <Ionicons name="remove" size={16} color={colorPalette.text} />
                  </Pressable>
                  <Text style={{ color: colorPalette.text, fontSize: 16, minWidth: 28, textAlign: 'center' }}>
                    {billingCycleInterval}
                  </Text>
                  <Pressable
                    onPress={() => setBillingCycleInterval(prev => prev + 1)}
                    style={{ padding: 8, backgroundColor: colorPalette.backgroundSecondary, borderRadius: 8 }}
                  >
                    <Ionicons name="add" size={16} color={colorPalette.text} />
                  </Pressable>
                  <Text style={{ color: colorPalette.textSecondary, fontSize: 14 }}>
                    {billingCycleInterval === 1
                      ? t(`billingCycle.${billingCycle === 'weekly' ? 'weekSingular' : billingCycle === 'monthly' ? 'monthSingular' : 'yearSingular'}`)
                      : t(`billingCycle.${billingCycle === 'weekly' ? 'weekPlural' : billingCycle === 'monthly' ? 'monthPlural' : 'yearPlural'}`)}
                  </Text>
                </View>
              </View>

              {/* Category */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.category')} <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={{ width: '100%', flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                  {Object.entries(t('categories', { returnObjects: true })).map(([key, value]: [string, string]) => (
                    <Pressable
                      key={key}
                      style={[styles.categoryContainer, {
                        backgroundColor: category === key ? colorPalette.secondary : colorPalette.backgroundSecondary,
                      }]}
                      onPress={() => setCategory(key as any)}
                    >
                      <Text style={{ color: category === key ? 'white' : colorPalette.text, fontSize: 16 }}>{value}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Labels */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('label.add')}</Text>
                <LabelsPicker
                  selectedLabelIds={selectedLabels}
                  setSelectedLabelIds={setSelectedLabels}
                  onToggleLabel={(id) =>
                    setSelectedLabels((prev) =>
                      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
                    )
                  }
                />
              </View>

              {/* First Billing Date */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.firstBillingDate')} <Text style={{ color: 'red' }}>*</Text></Text>
                <Pressable
                  style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary, paddingVertical: 20 }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={20} color={colorPalette.textSecondary} />
                  <Text style={{ color: colorPalette.text, fontSize: 16 }}>
                    {firstBillingDate.toLocaleDateString(localDevice || 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Text>
                  {showDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                      value={firstBillingDate}
                      mode="date"
                      display="default"
                      onChange={(_, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFirstBillingDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </Pressable>
                {Platform.OS === 'ios' && (
                  <Modal transparent={true} animationType="slide" visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
                    <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                      <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colorPalette.backgroundSecondary }]}>
                          <View style={styles.modalHeader}>
                            <Pressable onPress={() => setShowDatePicker(false)}>
                              <Text style={{ color: colorPalette.primary, fontSize: 16, fontWeight: '600' }}>
                                {t('addScreen.done')}
                              </Text>
                            </Pressable>
                          </View>
                          <DateTimePicker
                            value={firstBillingDate}
                            mode="date"
                            locale={localDevice || 'en-US'}
                            display="spinner"
                            textColor={colorPalette.text}
                            themeVariant={colorPalette.text === '#000000' ? 'light' : 'dark'}
                            onChange={(_, selectedDate) => {
                              if (selectedDate) {
                                setFirstBillingDate(selectedDate);
                              }
                            }}
                            style={{ height: 200 }}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                )}
                <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginTop: 6 }}>{t('viewSub.firstBillingDateHint')}</Text>
              </View>

              {/* Reminder */}
              <View style={[styles.reminderContainer, { backgroundColor: colorPalette.primary + '33', borderColor: colorPalette.primary }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View style={{ backgroundColor: colorPalette.primary + '33', borderRadius: 5, padding: 5 }}>
                      <Ionicons name="notifications-outline" size={20} color={colorPalette.primary} />
                    </View>
                    <Text style={{ color: colorPalette.text, fontSize: 16, flexShrink: 1 }}>
                      {t('addScreen.reminder')}
                    </Text>
                  </View>
                  <SwitchButton
                    value={isOn}
                    onPress={() => {
                      isOn.value = !isOn.value;
                      setReminder(!reminder);
                    }}
                    trackColors={{ on: colorPalette.primary, off: colorPalette.textSecondary }}
                  />
                </View>
                {reminder && (
                  <View style={{ marginTop: 10, gap: 10 }}>
                    <Text style={{ color: colorPalette.textSecondary, fontSize: 14, marginBottom: 5 }}>
                      {t('addScreen.notifyMe')}
                    </Text>
                    <Picker
                      selectedValue={reminderDaysBefore.toString()}
                      onValueChange={(itemValue) => setReminderDaysBefore(Number(itemValue))}
                      style={{ color: colorPalette.text, backgroundColor: 'transparent', borderRadius: 8 }}
                      dropdownIconColor={colorPalette.text}
                      itemStyle={{ color: colorPalette.text, fontSize: 16 }}
                      mode="dropdown"
                    >
                      {billingCycle === 'weekly' ? (
                        <>
                          <Picker.Item label={t('addScreen.sameDay')} value="0" />
                          <Picker.Item label={1 + ' ' + t('addScreen.dayBefore')} value="1" />
                          <Picker.Item label={3 + ' ' + t('addScreen.daysBefore')} value="3" />
                        </>
                      ) : (
                        <>
                          <Picker.Item label={1 + ' ' + t('addScreen.dayBefore')} value="1" />
                          <Picker.Item label={3 + ' ' + t('addScreen.daysBefore')} value="3" />
                          <Picker.Item label={1 + ' ' + t('addScreen.weekBefore')} value="7" />
                          <Picker.Item label={2 + ' ' + t('addScreen.weeksBefore')} value="14" />
                        </>
                      )}
                    </Picker>
                    <Text style={{ color: colorPalette.textSecondary, fontSize: 14 }}>{t('addScreen.notificationTime')}</Text>
                    <Pressable
                      style={[styles.input, { backgroundColor: colorPalette.background, paddingVertical: 14 }]}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Ionicons name="time-outline" size={20} color={colorPalette.primary} />
                      <Text style={{ color: colorPalette.text, fontSize: 16 }}>
                        {String(reminderTime.getHours()).padStart(2, '0')}:{String(reminderTime.getMinutes()).padStart(2, '0')}
                      </Text>
                    </Pressable>
                    {showTimePicker && Platform.OS === 'android' && (
                      <DateTimePicker
                        value={reminderTime}
                        mode="time"
                        display="default"
                        onChange={(_, selectedTime) => {
                          setShowTimePicker(false);
                          if (selectedTime) setReminderTime(selectedTime);
                        }}
                      />
                    )}
                    {Platform.OS === 'ios' && (
                      <Modal
                        transparent={true}
                        animationType="slide"
                        visible={showTimePicker}
                        onRequestClose={() => setShowTimePicker(false)}
                      >
                        <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                          <View style={styles.modalOverlay}>
                            <View style={[styles.modalContent, { backgroundColor: colorPalette.backgroundSecondary }]}>
                              <View style={styles.modalHeader}>
                                <Pressable onPress={() => setShowTimePicker(false)}>
                                  <Text style={{ color: colorPalette.primary, fontSize: 16, fontWeight: '600' }}>
                                    {t('addScreen.done')}
                                  </Text>
                                </Pressable>
                              </View>
                              <DateTimePicker
                                value={reminderTime}
                                mode="time"
                                display="spinner"
                                textColor={colorPalette.text}
                                themeVariant={colorPalette.text === '#000000' ? 'light' : 'dark'}
                                onChange={(_, selectedTime) => {
                                  if (selectedTime) setReminderTime(selectedTime);
                                }}
                                style={{ height: 200 }}
                              />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                    )}
                  </View>
                )}
              </View>

              {/* Save Button */}
              <Pressable
                style={{
                  shadowColor: colorPalette.primary,
                  shadowOffset: { width: 2, height: 5 },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,
                  elevation: 6,
                  marginTop: 20,
                  opacity: name.trim() === '' || price.trim() === '' ? 0.35 : 1,
                }}
                onPress={handleSave}
              >
                <LinearGradient
                  colors={[colorPalette.primary, colorPalette.secondary]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>{t('viewSub.saveChanges')}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Icon Picker Modal */}
      <IconPickerModal
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        iconName={iconName}
        iconLibrary={iconLibrary}
        iconColor={iconColor}
        onSelect={(name, library, color) => {
          setIconName(name);
          setIconLibrary(library);
          setIconColor(color);
          if (!isEditing) {
            modifySub({ ...subscription, iconName: name, iconLibrary: library as 'Ionicons' | 'MaterialCommunityIcons', iconColor: color });
          }
        }}
        onRemove={() => {
          setIconName(null);
          setIconLibrary(null);
          if (!isEditing) {
            modifySub({ ...subscription, iconName: null, iconLibrary: null });
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal transparent={true} animationType="fade" visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.deleteModalOverlay}>
          <View style={[styles.deleteModalContent, { backgroundColor: colorPalette.background }]}>
            <View style={[styles.deleteIconCircle, { backgroundColor: colorPalette.red + '20' }]}>
              <Ionicons name="trash-outline" size={40} color={colorPalette.red} />
            </View>
            <Text style={[styles.deleteModalTitle, { color: colorPalette.text, textAlign: 'center' }]}>{t('viewSub.areYouSureDelete')}</Text>
            <Text style={[styles.deleteModalMessage, { color: colorPalette.textSecondary }]}>
              {t('viewSub.deleteConfirmationMessage', { name: subscription.name })}
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={{flex: 1}}>
                <View style={[styles.cancelButton, { backgroundColor: colorPalette.backgroundSecondary }]}>
                  <Text style={[styles.cancelButtonText, { color: colorPalette.text }]}>{t('viewSub.cancel')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={{flex: 1}}>
                <View style={[styles.confirmDeleteButton, { backgroundColor: colorPalette.red }]}>
                  <Text style={styles.confirmDeleteButtonText}>{t('viewSub.delete')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  viewContainer: {
    padding: 20,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconGradient: {
    padding: 4,
    borderRadius: 30,
  },
  iconWrapper: {
    padding: 20,
    borderRadius: 26,
  },
  icon: {
    width: 60,
    height: 60,
  },
  subscriptionName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  priceCard: {
    marginBottom: 30,
  },
  priceGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  priceLabel: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  priceAmount: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  billingCycleText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  infoSection: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoIconContainer: {
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editContainer: {
    padding: 20,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  billingCycleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
  billingCycleTextContainer: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reminderContainer: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  deleteIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deleteModalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ViewSub;