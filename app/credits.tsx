import React from 'react';
import { View, Text, Pressable, Linking, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hook/ThemeHook';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Credits = () => {
  const router = useRouter();
  const { colorPalette } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const iconCredits = [
    { title: 'Cinema icons', author: 'Freepik', url: 'https://www.flaticon.com/free-icons/cinema' },
    { title: 'Productivity icons', author: 'Freepik', url: 'https://www.flaticon.com/free-icons/productivity' },
    { title: 'Nutrition icons', author: 'FBJan', url: 'https://www.flaticon.com/free-icons/nutrition' },
    { title: 'University icons', author: 'Freepik', url: 'https://www.flaticon.com/free-icons/university' },
    { title: 'Work icons', author: 'Freepik', url: 'https://www.flaticon.com/free-icons/work' },
    { title: 'House icons', author: 'Freepik', url: 'https://www.flaticon.com/free-icons/house' },
    { title: 'Subscription icons', author: 'Freepik', url: 'https://www.flaticon.com/free-icons/subscription' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colorPalette.background }}>
      {/* Header */}
      <View style={{ 
        paddingVertical: Platform.OS === 'android' ? insets.top + 10 : 10, 
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
          {t('credits.title', 'Credits')}
        </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          padding: 20,
          paddingBottom: insets.bottom + 40
        }}
      >
        {/* Header with gradient */}
        <View style={{
          shadowColor: colorPalette.primary,
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.43,
          shadowRadius: 9.51,
          elevation: 15,
          marginBottom: 24,
        }}>
          <LinearGradient
            colors={[colorPalette.primary, colorPalette.secondary]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20, borderRadius: 20 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="heart" size={40} color="white" style={{ marginBottom: 12 }} />
              <Text style={{ 
                color: 'white', 
                fontSize: 24, 
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 8
              }}>
                {t('credits.thanksTitle', 'Thanks to the Creators')}
              </Text>
              <Text style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: 14,
                textAlign: 'center'
              }}>
                {t('credits.thanksMessage', 'This app wouldn\'t be possible without these amazing icon creators')}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Icon Credits Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: 16
          }}>
            <Ionicons name="images-outline" size={24} color={colorPalette.primary} />
            <Text style={{ 
              color: colorPalette.text, 
              fontSize: 18, 
              fontWeight: 'bold',
              marginLeft: 12
            }}>
              {t('credits.iconCredits', 'Icon Credits')}
            </Text>
          </View>
          
          <View style={{ gap: 10 }}>
            {iconCredits.map((credit, index) => (
              <Pressable 
                key={index}
                onPress={() => Linking.openURL(credit.url)}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  padding: 14,
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
                <View style={{
                  backgroundColor: colorPalette.primary + '20',
                  padding: 8,
                  borderRadius: 8,
                  marginRight: 12
                }}>
                  <Ionicons name="link-outline" size={20} color={colorPalette.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    color: colorPalette.text, 
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 2
                  }}>
                    {credit.title}
                  </Text>
                  <Text style={{ color: colorPalette.textSecondary, fontSize: 12 }}>
                    Created by{' '}
                    <Text style={{ color: colorPalette.primary, fontWeight: '600' }}>
                      {credit.author}
                    </Text>
                    {' '}• Flaticon
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colorPalette.textSecondary} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Copyright Section */}
        <View style={{
          padding: 20,
          backgroundColor: colorPalette.backgroundSecondary,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colorPalette.border,
          alignItems: 'center',
        }}>
          <Ionicons name="information-circle-outline" size={32} color={colorPalette.textSecondary} style={{ marginBottom: 12 }} />
          <Text style={{ 
            color: colorPalette.text, 
            fontSize: 16, 
            fontWeight: 'bold',
            marginBottom: 8
          }}>
            SubTrack
          </Text>
          <Text style={{ 
            color: colorPalette.textSecondary, 
            fontSize: 12,
            textAlign: 'center'
          }}>
            © {new Date().getFullYear()} SubTrack.{'\n'}All rights reserved.
          </Text>
        </View>

        {/* Additional Info */}
        <Text style={{ 
          color: colorPalette.textSecondary, 
          fontSize: 11,
          textAlign: 'center',
          marginTop: 20,
          lineHeight: 16
        }}>
          {t('credits.madeWith', 'Made with')} ❤️ {t('credits.forTracking', 'for better subscription tracking')} by Pellegrino Piccolo
        </Text>
      </ScrollView>
    </View>
  );
};

export default Credits;
