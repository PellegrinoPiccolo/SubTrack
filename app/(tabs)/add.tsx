import React from 'react'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import useTheme from '../../hook/ThemeHook';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getLocales } from 'expo-localization';
import DateTimePicker from '@react-native-community/datetimepicker';

const add = () => {

  const {colorPalette} = useTheme();
  const {t} = useTranslation();

  const router = useRouter();

  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [price, setPrice] = React.useState<string>('');
  const [link, setLink] = React.useState<string>('');
  const [billingCycle, setBillingCycle] = React.useState<string>('monthly');
  const [category, setCategory] = React.useState<string>('Entertainment');
  const [firstBillingDate, setFirstBillingDate] = React.useState<Date>(new Date());
  const [reminder, setReminder] = React.useState<boolean>(true);
  const [reminderDaysBefore, setReminderDaysBefore] = React.useState<number>(1);
  
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);

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
    router.back();
  }

  return (
    <ScrollView style={{ 
      flex: 1, 
      backgroundColor: colorPalette.background,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 15,
        paddingVertical: 10,
      }}>
        <View style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <Text style={{
            color: colorPalette.text,
            fontSize: 20,
            fontWeight: 500,
          }}>
            {t('addScreen.title')}
          </Text>
          <Text style={{
            color: colorPalette.textSecondary,
            fontSize: 14,
            marginTop: 5,
          }}>
            {t('addScreen.subTitle')}
          </Text>
        </View>
        <Pressable onPress={close} style={{
          backgroundColor: colorPalette.backgroundSecondary,
          padding: 10,
          borderRadius: 10,
        }}>
          <Ionicons name="close" size={20} color={colorPalette.text} />
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        {/* Form inputs will go here */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.name')} *</Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]} >
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={'Netflix, Spotify, ...'}
              placeholderTextColor={colorPalette.textSecondary}
              style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.description')}</Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]} >
            <TextInput
              value={description}
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
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.price')} *</Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]} >
            <Text style={{
              color: colorPalette.textSecondary,
              fontSize: 16,
            }}>{localDevice === 'en' ? '$' : '€'}</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder={'0.00'}
              placeholderTextColor={colorPalette.textSecondary}
              keyboardType='decimal-pad'
              style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.link')}</Text>
          <View style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary }]} >
            <TextInput
              value={link}
              onChangeText={setLink}
              placeholder={'https://'}
              placeholderTextColor={colorPalette.textSecondary}
              style={{ color: colorPalette.text, paddingVertical: 10, flex: 1 }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.billingCycle')} *</Text>
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
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.category')} *</Text>
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
          <Text style={[styles.label, { color: colorPalette.text }]}>{t('addScreen.firstBillingDate')} *</Text>
          <Pressable style={[styles.input, { backgroundColor: colorPalette.backgroundSecondary, paddingVertical: 20 }]} onPress={() => setShowDatePicker(true)} >
            <Ionicons name="calendar" size={20} color={colorPalette.textSecondary} />
            <Text style={{ color: firstBillingDate ? colorPalette.text : colorPalette.textSecondary, fontSize: 16 }}>
              {firstBillingDate ? firstBillingDate.toLocaleDateString() : t('addScreen.selectDate')}
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
        </View>
      </View>
    </ScrollView>
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
  }
})

export default add