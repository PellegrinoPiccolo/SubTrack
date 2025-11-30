import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import useTheme from '../../hook/ThemeHook';
import { useTranslation } from 'react-i18next';
import { Pie, PolarChart } from "victory-native";
import useSubs from '../../hook/SubsHook';
import { getLocales } from 'expo-localization';

const Category = () => {

  const {colorPalette} = useTheme();
  const {t} = useTranslation();
  const {subs} = useSubs();

  const calcMonthlyPriceByCategory = (category: string) => {
    let total = 0;
    subs.forEach(sub => {
      if (sub.category === category) {
        if (sub.billingCycle === 'monthly') {
          total += parseFloat(sub.price);
        } else if (sub.billingCycle === 'yearly') {
          total += parseFloat(sub.price) / 12;
        }
      }
    });
    return total;
  }

  const DATA = [
    { label: "Entertainment", value: subs.filter(sub => sub.category === "Entertainment").length, color: colorPalette.primary },
    { label: "Productivity", value: subs.filter(sub => sub.category === "Productivity").length, color: colorPalette.secondary },
    { label: "Fittnes&Health", value: subs.filter(sub => sub.category === "Fittnes&Health").length, color: colorPalette.azure },
    { label: "Education", value: subs.filter(sub => sub.category === "Education").length, color: colorPalette.red },
    { label: "Work", value: subs.filter(sub => sub.category === "Work").length, color: colorPalette.orange },
    { label: "Home", value: subs.filter(sub => sub.category === "Home").length, color: 'pink' },
    { label: "Other", value: subs.filter(sub => sub.category === "Other").length, color: '#E0E104' },
  ];

  if (subs.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorPalette.background, padding: 20}}>
        <Text style={{color: colorPalette.text, fontSize: 18, textAlign: 'center'}}>{t('categories.noData')}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: colorPalette.background}}>
      <View style={{margin: 20,}}>
        <Text style={{color: colorPalette.text, fontSize: 24, marginBottom: 10, fontWeight: 'bold'}}>{t('category.title')}</Text>
        <Text style={{color: colorPalette.textSecondary, fontSize: 16, marginBottom: 10}}>{t('category.description')}</Text>
      </View>
      <View style={{flex: 1, marginTop: 20, width: '90%', flexDirection: 'column', alignItems: 'center', backgroundColor: colorPalette.backgroundSecondary, alignSelf: 'center', borderRadius: 12, padding: 20}}>
        <View style={{height: 300, width: 300}}>
          <PolarChart
            data={DATA} // 👈 specify your data
            labelKey={"label"} // 👈 specify data key for labels
            valueKey={"value"} // 👈 specify data key for values
            colorKey={"color"} // 👈 specify data key for color
          >
            <Pie.Chart />
          </PolarChart>
        </View>
        <View style={{flex: 1, paddingLeft: 20, justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%', marginTop: 40}}>
          {DATA.map((item, index) => {
            // Calculate total value
            const total = DATA.reduce((sum, curr) => sum + curr.value, 0);
            // Calculate percentage
            const percentage = ((item.value / total) * 100).toFixed(1);
            if(percentage === '0.0') return null;
            return (
              <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <View style={{width: 16, height: 16, backgroundColor: item.color, marginRight: 10, borderRadius: 50}} />
                <Text style={{color: colorPalette.text, fontSize: 16}}>{t(`categories.${item.label}`)}: {percentage}%</Text>
              </View>
            )
          })}
        </View>
      </View>
      <View style={{margin: 20, marginTop: 40, marginBottom: 60, gap: 10}}>
        <Text style={{color: colorPalette.text, fontSize: 18, fontWeight: 'bold'}}>{t('category.categoryBreakdown')}</Text>
        {DATA.map((item, index) => {
          if(item.value === 0) return null;
          return (
            <View key={index} style={{flexDirection: 'column',  marginTop: 10, padding: 20, backgroundColor: colorPalette.background, borderRadius: 8, borderColor: colorPalette.border, borderWidth: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <View style={{width: 16, height: 16, backgroundColor: item.color, borderRadius: 50}} />
                  <Text style={{color: colorPalette.text, fontSize: 18}}>{t(`categories.${item.label}`)}</Text>
                </View>
                <View style={{flexDirection: 'column', alignItems: 'center', gap: 1}}>
                  <Text style={{fontSize: 18, color: colorPalette.text}}>{getLocales()[0].currencySymbol} {calcMonthlyPriceByCategory(item.label).toFixed(2)}</Text>
                  <Text style={{fontSize: 16, color: colorPalette.textSecondary}}>/{t('category.monthly')}</Text>
                </View>
              </View>
              <View style={{marginTop: 20, height: 14, width: '100%', backgroundColor: colorPalette.backgroundSecondary, borderRadius: 8}}>
                <View style={{height: '100%', width: `${(item.value / subs.length) * 100}%`, backgroundColor: item.color, borderRadius: 8}} />
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <Text style={{color: colorPalette.textSecondary, fontSize: 16, backgroundColor: colorPalette.backgroundSecondary, padding: 4, borderRadius: 4}}>{item.value} {item.value === 1 ? t('category.subscription') : t('category.subscriptions')}</Text>
                <Text style={{color: colorPalette.textSecondary, fontSize: 16, backgroundColor: colorPalette.backgroundSecondary, padding: 4, borderRadius: 4}}>{((item.value / subs.length) * 100).toFixed(1)}%</Text>
              </View>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

export default Category