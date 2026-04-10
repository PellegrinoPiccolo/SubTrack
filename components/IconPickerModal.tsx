import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import useTheme from '../hook/ThemeHook';
import { BRAND_ICONS, CUSTOM_ICONS } from '../constants/CustomIcons';
import { ICON_COLORS } from '../constants/PresetSubscriptions';
import SubIcon from './SubIcon';

interface IconPickerModalProps {
  visible: boolean;
  onClose: () => void;
  iconName: string | null;
  iconLibrary: string | null;
  iconColor: string;
  onSelect: (iconName: string, iconLibrary: string, iconColor: string) => void;
  onRemove?: () => void;
}

const IconPickerModal = ({
  visible,
  onClose,
  iconName,
  iconLibrary,
  iconColor,
  onSelect,
  onRemove,
}: IconPickerModalProps) => {
  const { colorPalette } = useTheme();
  const { t } = useTranslation();

  const [selectedIcon, setSelectedIcon] = useState<string | null>(iconName);
  const [selectedLibrary, setSelectedLibrary] = useState<string>(iconLibrary || 'Ionicons');
  const [selectedColor, setSelectedColor] = useState<string>(iconColor);

  useEffect(() => {
    if (visible) {
      setSelectedIcon(iconName);
      setSelectedLibrary(iconLibrary || 'Ionicons');
      setSelectedColor(iconColor);
    }
  }, [visible]);

  const handleConfirm = () => {
    if (selectedIcon) {
      onSelect(selectedIcon, selectedLibrary, selectedColor);
    }
    onClose();
  };

  const selectIcon = (name: string, library: string) => {
    setSelectedIcon(name);
    setSelectedLibrary(library);
  };

  const renderIconCell = (icon: { name: string; library?: string }) => {
    const lib = icon.library || 'Ionicons';
    const isSelected = selectedIcon === icon.name && selectedLibrary === lib;
    return (
      <Pressable
        key={`${lib}-${icon.name}`}
        onPress={() => selectIcon(icon.name, lib)}
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          backgroundColor: isSelected ? selectedColor : colorPalette.backgroundSecondary,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: isSelected ? 0 : 1,
          borderColor: colorPalette.border,
        }}
      >
        {lib === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons
            name={icon.name as any}
            size={24}
            color={isSelected ? 'white' : colorPalette.text}
          />
        ) : (
          <Ionicons
            name={icon.name as any}
            size={24}
            color={isSelected ? 'white' : colorPalette.text}
          />
        )}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colorPalette.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: 36,
            maxHeight: '85%',
          }}
          onPress={() => {}}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: colorPalette.text, fontSize: 18, fontWeight: '600' }}>
              {t('selectSub.chooseIcon', 'Choose Icon')}
            </Text>
            <Pressable onPress={onClose} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color={colorPalette.text} />
            </Pressable>
          </View>

          {/* Preview */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            {selectedIcon ? (
              <SubIcon
                iconName={selectedIcon}
                iconLibrary={selectedLibrary}
                iconColor={selectedColor}
                containerSize={72}
                iconSize={38}
                borderRadius={20}
                shadow
              />
            ) : (
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  backgroundColor: colorPalette.backgroundSecondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: colorPalette.border,
                  borderStyle: 'dashed',
                }}
              >
                <Ionicons name="apps-outline" size={32} color={colorPalette.textSecondary} />
              </View>
            )}
          </View>

          {/* Color picker */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
            style={{ marginBottom: 14 }}
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
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: color }} />
              </Pressable>
            ))}
          </ScrollView>

          {/* Icons grid */}
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
            {/* Brand icons */}
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 }}>
              BRANDS
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {BRAND_ICONS.map(renderIconCell)}
            </View>

            {/* Generic icons */}
            <Text style={{ color: colorPalette.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 }}>
              ICONS
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {CUSTOM_ICONS.map(renderIconCell)}
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            {onRemove && iconName && (
              <Pressable
                onPress={() => { onRemove(); onClose(); }}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 10,
                  backgroundColor: colorPalette.backgroundSecondary,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colorPalette.textSecondary, fontSize: 15 }}>
                  Remove
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleConfirm}
              disabled={!selectedIcon}
              style={{
                flex: 2,
                padding: 14,
                borderRadius: 10,
                backgroundColor: selectedIcon ? colorPalette.primary : colorPalette.backgroundSecondary,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: selectedIcon ? 'white' : colorPalette.textSecondary, fontSize: 15, fontWeight: '600' }}>
                {t('addScreen.done', 'Done')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default IconPickerModal;
