import React, { useState, useMemo } from 'react'
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useTheme from '../hook/ThemeHook'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PRESET_SUBSCRIPTIONS, ICON_COLORS } from '../constants/PresetSubscriptions'
import { CUSTOM_ICONS } from '../constants/CustomIcons'
import SubIcon from '../components/SubIcon'

const SelectSub = () => {
  const { colorPalette } = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [search, setSearch] = useState('')
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [selectedCustomIcon, setSelectedCustomIcon] = useState('star')
  const [selectedColor, setSelectedColor] = useState(ICON_COLORS[4]) // green default

  const filteredPresets = useMemo(() => {
    if (!search.trim()) return PRESET_SUBSCRIPTIONS
    return PRESET_SUBSCRIPTIONS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handlePresetSelect = (preset: typeof PRESET_SUBSCRIPTIONS[0]) => {
    router.push({
      pathname: '/add',
      params: {
        presetName: preset.name,
        presetIconName: preset.iconName,
        presetIconLibrary: preset.iconLibrary,
        presetIconColor: preset.iconColor,
        presetCategory: preset.category,
      },
    })
  }

  const handleCustomContinue = () => {
    setShowCustomModal(false)
    router.push({
      pathname: '/add',
      params: {
        presetIconName: selectedCustomIcon,
        presetIconLibrary: 'Ionicons',
        presetIconColor: selectedColor,
      },
    })
  }

  return (
    <>
      {/* Header */}
      <View
        style={{
          paddingTop: Platform.OS === 'android' ? insets.top : 10,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          borderBottomColor: colorPalette.border,
          borderBottomWidth: 1,
          backgroundColor: colorPalette.background,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colorPalette.text} />
        </Pressable>
        <Text
          style={{
            color: colorPalette.text,
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
            marginLeft: 16,
          }}
        >
          {t('selectSub.title')}
        </Text>
      </View>

      <View style={{ flex: 1, backgroundColor: colorPalette.background }}>
        {/* Search bar */}
        <View
          style={{
            margin: 16,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colorPalette.backgroundSecondary,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: Platform.OS === 'ios' ? 10 : 4,
            gap: 8,
          }}
        >
          <Ionicons name="search" size={18} color={colorPalette.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('selectSub.search')}
            placeholderTextColor={colorPalette.textSecondary}
            style={{ flex: 1, color: colorPalette.text, fontSize: 15 }}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colorPalette.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Grid */}
        <FlatList
          data={filteredPresets}
          keyExtractor={item => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40 }}
          columnWrapperStyle={{ gap: 0 }}
          ListHeaderComponent={
            !search.trim() ? (
              <>
                <Text
                  style={{
                    color: colorPalette.textSecondary,
                    fontSize: 12,
                    fontWeight: '600',
                    marginLeft: 4,
                    marginBottom: 8,
                    marginTop: 8,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('selectSub.customSection')}
                </Text>
                <Pressable
                  onPress={() => setShowCustomModal(true)}
                  style={[
                    styles.customCard,
                    {
                      backgroundColor: colorPalette.backgroundSecondary,
                      borderColor: colorPalette.primary,
                      marginBottom: 16,
                      marginHorizontal: 4,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.customIconBox,
                      {
                        backgroundColor: colorPalette.primary + '22',
                        borderColor: colorPalette.primary,
                      },
                    ]}
                  >
                    <Ionicons name="add" size={28} color={colorPalette.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colorPalette.text, fontSize: 16, fontWeight: '600' }}>
                      {t('selectSub.custom')}
                    </Text>
                    <Text style={{ color: colorPalette.textSecondary, fontSize: 13, marginTop: 2 }}>
                      {t('selectSub.customSubtitle')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colorPalette.textSecondary} />
                </Pressable>
                <Text
                  style={{
                    color: colorPalette.textSecondary,
                    fontSize: 12,
                    fontWeight: '600',
                    marginLeft: 4,
                    marginBottom: 8,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('selectSub.presetsSection')}
                </Text>
              </>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePresetSelect(item)}
              style={[
                styles.presetCard,
                {
                  backgroundColor: colorPalette.backgroundSecondary,
                  borderColor: colorPalette.border,
                },
              ]}
            >
              <SubIcon
                iconName={item.iconName}
                iconLibrary={item.iconLibrary}
                iconColor={item.iconColor}
                containerSize={50}
                iconSize={26}
                borderRadius={14}
              />
              <Text
                style={{
                  color: colorPalette.text,
                  fontSize: 11,
                  textAlign: 'center',
                  fontWeight: '500',
                  marginTop: 6,
                }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Custom Icon Picker Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCustomModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: colorPalette.background,
                    paddingBottom: insets.bottom + 24,
                  },
                ]}
              >
                {/* Handle */}
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colorPalette.border,
                    alignSelf: 'center',
                    marginBottom: 20,
                  }}
                />

                <Text
                  style={{
                    color: colorPalette.text,
                    fontSize: 18,
                    fontWeight: '700',
                    marginBottom: 20,
                  }}
                >
                  {t('selectSub.chooseIcon')}
                </Text>

                {/* Icon Preview */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 20,
                      backgroundColor: selectedColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: selectedColor,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.45,
                      shadowRadius: 10,
                      elevation: 8,
                    }}
                  >
                    <Ionicons name={selectedCustomIcon as any} size={38} color="white" />
                  </View>
                </View>

                {/* Color Picker */}
                <Text
                  style={{
                    color: colorPalette.textSecondary,
                    fontSize: 13,
                    marginBottom: 10,
                  }}
                >
                  {t('selectSub.chooseColor')}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 20 }}
                  contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
                >
                  {ICON_COLORS.map(color => (
                    <Pressable
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={{
                        padding: 3,
                        borderRadius: 20,
                        borderWidth: 2.5,
                        borderColor: selectedColor === color ? colorPalette.text : 'transparent',
                      }}
                    >
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: color,
                        }}
                      />
                    </Pressable>
                  ))}
                </ScrollView>

                {/* Icon Grid */}
                <Text
                  style={{
                    color: colorPalette.textSecondary,
                    fontSize: 13,
                    marginBottom: 10,
                  }}
                >
                  {t('selectSub.chooseIconLabel')}
                </Text>
                <ScrollView
                  style={{ maxHeight: 240 }}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {CUSTOM_ICONS.map(icon => (
                      <Pressable
                        key={icon.name}
                        onPress={() => setSelectedCustomIcon(icon.name)}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 12,
                          backgroundColor:
                            selectedCustomIcon === icon.name
                              ? selectedColor
                              : colorPalette.backgroundSecondary,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1.5,
                          borderColor:
                            selectedCustomIcon === icon.name ? selectedColor : 'transparent',
                        }}
                      >
                        <Ionicons
                          name={icon.name as any}
                          size={24}
                          color={selectedCustomIcon === icon.name ? 'white' : colorPalette.text}
                        />
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>

                {/* Continue Button */}
                <Pressable
                  onPress={handleCustomContinue}
                  style={{
                    marginTop: 20,
                    backgroundColor: selectedColor,
                    borderRadius: 10,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {t('selectSub.continue')}
                  </Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  customCard: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
  },
  customIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  presetCard: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  presetIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
})

export default SelectSub
