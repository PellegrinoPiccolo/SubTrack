import React from 'react'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import useTheme from '../hook/ThemeHook';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getLocales } from 'expo-localization';
import useCurrency from '../hook/CurrencyHook';
import DateTimePicker from '@react-native-community/datetimepicker';
import SwitchButton from '../components/SwitchButton';
import LabelsPicker from '../components/LabelsPicker';
import { useSharedValue } from 'react-native-reanimated';
import {Picker} from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SubscriptionType } from '../types/SubscriptionType';
import useSubs from '../hook/SubsHook';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const add = () => {

  const {colorPalette} = useTheme();
  const {t} = useTranslation();
  const { currencySymbol } = useCurrency();
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>([]);
  const {addSub, labels, createLabel, deleteLabel} = useSubs();

  const router = useRouter();

  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string | null>(null);
  const [price, setPrice] = React.useState<string>('');
  const [link, setLink] = React.useState<string | null>(null);
  const [billingCycle, setBillingCycle] = React.useState<string>('monthly');
  const [category, setCategory] = React.useState<string>('Entertainment');
  const [firstBillingDate, setFirstBillingDate] = React.useState<Date>(new Date());
  const [reminder, setReminder] = React.useState<boolean>(true);
  const isOn = useSharedValue(reminder);
  const [reminderDaysBefore, setReminderDaysBefore] = React.useState<number>(1);
  
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);

  const [showErrors, setShowErrors] = React.useState<boolean>(false);

  const localDevice = getLocales()[0].languageCode;

  const close = () => {
    setName('');
    setDescription('');
    setPrice('');
    setLink('');
    setBillingCycle('monthly');
    setCategory('Entertainment');
    setFirstBillingDate(new Date());
    setReminder(true);
    setReminderDaysBefore(1);
    setSelectedLabels([]);
    router.back();
  }

  const save = () => {
    if(name.trim() === '' || price.trim() === '' || !billingCycle || !category || !firstBillingDate) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    const newSub : SubscriptionType = {
      id: Date.now().toString(),
      name,
      description,
      price,
      link,
      billingCycle: billingCycle as 'monthly' | 'yearly',
      category: category as 'Entertainment' | 'Productivity' | 'Education' | 'Fittnes&Health' | 'Work' | 'Home' | 'Other',
      firstBillingDate,
      reminder,
      reminderDaysBefore,
      labels: selectedLabels,
    }
    addSub(newSub);
    close();
  }

  const insets = useSafeAreaInsets();

  return (
    <>
    <View style={{ 
        paddingTop: Platform.OS === 'android' ? insets.top : 10,
        paddingBottom: 10,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomColor: colorPalette.border,
        borderBottomWidth: 1,
        backgroundColor: colorPalette.background
      }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colorPalette.text} />
        </Pressable>
        <Text style={{ 
          color: colorPalette.text, 
          fontSize: 18, 
          fontWeight: 'bold',
          flex: 1,
          marginLeft: 16
        }}>
          {t('addScreen.title', 'Add Subscription')}
        </Text>
      </View>
    <ScrollView showsVerticalScrollIndicator={false} style={{ 
      flex: 1, 
      backgroundColor: colorPalette.background,
    }}>
      <View style={styles.formContainer}>
        {/* Form inputs will go here */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.name')} <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary, borderWidth: 1, borderColor: showErrors && name.trim() === '' ? 'red' : 'transparent' }]} >
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={'Netflix, Spotify, ...'}
              placeholderTextColor={colorPalette.textSecondary}
              style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
            />
          </View>
          {showErrors && name.trim() === '' && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{t('addScreen.errors.requiredFields')}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.description')}</Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]} >
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
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.price')} <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary, borderWidth: 1, borderColor: showErrors && price.trim() === '' ? 'red' : 'transparent' }]} >
            <Text style={{
              color: colorPalette.textSecondary,
              fontSize: 16,
            }}>{currencySymbol}</Text>
            <TextInput
              value={price}
              onChangeText={(text) => setPrice(text.replace(',', '.').replace(/[^0-9,.]/g, '').replace(/(\..*)\./g, '$1'))}
              placeholder={'0.00'}
              placeholderTextColor={colorPalette.textSecondary}
              keyboardType='decimal-pad'
              style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
            />
          </View>
          {showErrors && price.trim() === '' && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{t('addScreen.errors.requiredFields')}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.link')}</Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]} >
            <TextInput
              value={link || ''}
              onChangeText={setLink}
              placeholder={'https://'}
              placeholderTextColor={colorPalette.textSecondary}
              style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.billingCycle')} <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={[styles.billingCycleContainer, { backgroundColor: colorPalette.backgroundSecondary }]} >
            <Pressable style={[styles.billingCycleTextContainer, {backgroundColor: billingCycle === 'monthly' ? colorPalette.primary : 'transparent'}]} onPress={() => setBillingCycle('monthly')}>
              <Text style={{ color: billingCycle === 'monthly' ? 'white' : colorPalette.textSecondary, fontSize: 16 }}>{t(`billingCycle.monthly`)}</Text>
            </Pressable>
            <Pressable style={[styles.billingCycleTextContainer, {backgroundColor: billingCycle === 'yearly' ? colorPalette.primary : 'transparent'}]} onPress={() => setBillingCycle('yearly')}>
              <Text style={{ color: billingCycle === 'yearly' ? 'white' : colorPalette.textSecondary, fontSize: 16 }}>{t(`billingCycle.yearly`)}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.category')} <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={{ width: '100%', flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            {
              Object.entries(t('categories', { returnObjects: true })).map(([key, value]: [string, string]) => (
                <Pressable key={key} style={[styles.categoryContainer, { 
                  backgroundColor: category === key ? colorPalette.secondary : colorPalette.backgroundSecondary,
                }]} onPress={() => setCategory(key)}>
                  <Text style={{ color: category === key ? 'white' : colorPalette.text, fontSize: 16 }}>{value}</Text>
                </Pressable>
              ))
            }
          </View>
        </View>
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
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.firstBillingDate')} <Text style={{ color: 'red' }}>*</Text></Text>
          <Pressable style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary, paddingVertical: 20 }]} onPress={() => setShowDatePicker(true)} >
            <Ionicons name="calendar" size={20} color={colorPalette.textSecondary} />
            <Text style={{ color: firstBillingDate ? colorPalette.text : colorPalette.textSecondary, fontSize: 16 }}>
              {firstBillingDate ? firstBillingDate.toLocaleDateString(localDevice || 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) : t('addScreen.selectDate')}
            </Text>
            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={firstBillingDate}
                maximumDate={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFirstBillingDate(selectedDate);
                  }
                }}
              />
            )}
          </Pressable>
          {Platform.OS === 'ios' && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colorPalette.backgroundSecondary }]}>
                      {/* Pulsante "Fatto" per chiudere su iOS */}
                      <View style={styles.modalHeader}>
                        <Pressable onPress={() => setShowDatePicker(false)}>
                          <Text style={{ color: colorPalette.primary, fontSize: 16, fontWeight: '600' }}>{t('addScreen.done')}</Text>
                        </Pressable>
                      </View>
                      
                      <DateTimePicker
                        value={firstBillingDate}
                        mode="date"
                        locale={localDevice || 'en-US'}
                        display="spinner" // Usa "spinner" o "inline" per iOS dentro la modale
                        textColor={colorPalette.text} // Importante per il tema scuro
                        themeVariant={colorPalette.text === '#000000' ? 'light' : 'dark'} // Forza tema scuro/chiaro
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setFirstBillingDate(selectedDate);
                          }
                        }}
                        maximumDate={new Date()}
                        style={{ height: 200 }} // Altezza fissa per lo spinner
                      />
                    </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
          <Text style={{ color: colorPalette.textSecondary, fontSize: 12, marginTop: 6 }}>{t('addScreen.firstBillingDateHint')}</Text>
        </View>
        <View style={[styles.reminderContainer, { backgroundColor: colorPalette.primary + '33', borderColor: colorPalette.primary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={{ backgroundColor: colorPalette.primary + '33', borderRadius: 5, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="notifications-outline" size={20} color={colorPalette.primary} />
              </View>
              <Text style={{ color: colorPalette.text, fontSize: 16, flexShrink: 1 }}>{t('addScreen.reminder')}</Text>
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
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: colorPalette.textSecondary, fontSize: 14, marginBottom: 5 }}>{t('addScreen.notifyMe')}</Text>
              <Picker
                selectedValue={reminderDaysBefore.toString()}
                onValueChange={(itemValue) => setReminderDaysBefore(Number(itemValue))}
                style={{ color: colorPalette.text, backgroundColor: 'transparent', borderRadius: 8 }}
                dropdownIconColor={colorPalette.text}
                itemStyle={{ color: colorPalette.text, fontSize: 16 }}
                mode='dropdown'
                dropdownIconRippleColor={colorPalette.backgroundSecondary}
                selectionColor={colorPalette.primary}
              >
                <Picker.Item label={1 + ' ' + t('addScreen.dayBefore')} value="1" />
                <Picker.Item label={3 + ' ' + t('addScreen.daysBefore')} value="3" />
                <Picker.Item label={1 + ' ' + t('addScreen.weekBefore')} value="7" />
                <Picker.Item label={2 + ' ' + t('addScreen.weeksBefore')} value="14" />
              </Picker>
            </View>
          )}
        </View>
        <Pressable
          style={{
            shadowColor: colorPalette.primary,
            shadowOffset: {
              width: 2,
              height: 5,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
            opacity: name.trim() === '' || price.trim() === '' ? 0.35 : 1,
          }}
          onPress={save}
        >
          <LinearGradient 
            colors={[colorPalette.primary, colorPalette.secondary]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 30,
              marginBottom: 40,
              paddingVertical: 15,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{t('addScreen.add')}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
</>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 20,
    marginHorizontal: 15,
    flexDirection: 'column',
    gap: 15,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  billingCycleContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billingCycleTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 8,
    flex: 1,
  },
  categoryContainer: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  // ... altri stili esistenti
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Sfondo semitrasparente scuro
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40, // Spazio extra per i telefoni con la home bar
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  reminderContainer: {
    borderRadius: 8,
    padding: 10,
    borderWidth: 0.5,
  }
})

export default add