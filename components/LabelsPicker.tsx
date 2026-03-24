import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import useTheme from '../hook/ThemeHook'
import useSubs from '../hook/SubsHook'
import { LabelsType } from '../types/LabelsType'

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
]

interface Props {
  selectedLabelIds: string[]
  onToggleLabel: (labelId: string) => void
}

const LabelsPicker = ({ selectedLabelIds, onToggleLabel }: Props) => {
  const { t } = useTranslation()
  const { colorPalette } = useTheme()
  const { labels, createLabel, deleteLabel } = useSubs()

  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])

  const handleCreate = () => {
    if (!newName.trim()) return
    const label: LabelsType = {
      id: Date.now().toString(),
      name: newName.trim(),
      color: newColor,
    }
    createLabel?.(label)
    setNewName('')
    setNewColor(PRESET_COLORS[0])
    setShowForm(false)
  }

  const handleCancel = () => {
    setNewName('')
    setNewColor(PRESET_COLORS[0])
    setShowForm(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelsRow}>
        {labels?.map((label) => {
          const selected = selectedLabelIds.includes(label.id)
          return (
            <Pressable
              key={label.id}
              onPress={() => onToggleLabel(label.id)}
              onLongPress={() => deleteLabel?.(label.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? label.color + '33' : colorPalette.backgroundSecondary,
                  borderColor: selected ? label.color : 'transparent',
                  borderWidth: 1.5,
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: label.color }]} />
              <Text style={[styles.chipText, { color: colorPalette.text }]}>{label.name}</Text>
              {selected && (
                <Ionicons name="checkmark" size={14} color={label.color} />
              )}
            </Pressable>
          )
        })}

        <Pressable
          onPress={() => setShowForm(true)}
          style={[styles.chip, styles.addChip, { backgroundColor: colorPalette.backgroundSecondary }]}
        >
          <Ionicons name="add" size={16} color={colorPalette.textSecondary} />
          <Text style={[styles.chipText, { color: colorPalette.textSecondary }]}>{t('label.new')}</Text>
        </Pressable>
      </View>

      {labels && labels.length > 0 && (
        <Text style={[styles.hint, { color: colorPalette.textSecondary }]}>
          {t('label.longPressToDelete')}
        </Text>
      )}

      {showForm && (
        <View style={[styles.form, { backgroundColor: colorPalette.backgroundSecondary }]}>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder={t('label.namePlaceholder')}
            placeholderTextColor={colorPalette.textSecondary}
            style={[styles.input, { color: colorPalette.text, borderColor: colorPalette.textSecondary + '44' }]}
            maxLength={20}
          />

          <View style={styles.colorRow}>
            {PRESET_COLORS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setNewColor(color)}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  newColor === color && styles.colorDotSelected,
                ]}
              >
                {newColor === color && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.formActions}>
            <Pressable onPress={handleCancel} style={[styles.actionBtn, { backgroundColor: colorPalette.background }]}>
              <Text style={[styles.actionText, { color: colorPalette.textSecondary }]}>{t('label.cancel')}</Text>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              style={[styles.actionBtn, { backgroundColor: newColor, opacity: newName.trim() ? 1 : 0.5 }]}
              disabled={!newName.trim()}
            >
              <Text style={[styles.actionText, { color: 'white' }]}>{t('label.create')}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addChip: {
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 14,
  },
  hint: {
    fontSize: 11,
    marginTop: 2,
  },
  form: {
    borderRadius: 10,
    padding: 12,
    gap: 12,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 2.5,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export default LabelsPicker
