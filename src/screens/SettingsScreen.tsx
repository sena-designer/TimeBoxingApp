import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Switch
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useI18n } from '../hooks/useI18n';
import { useTheme, THEME_COLORS } from '../hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const { language, setLanguage, t } = useI18n();
    const { isDarkMode, setDarkMode, themeColorName, setThemeColor, colors } = useTheme();

    const languages = [
        { value: 'ja' as const, label: '日本語' },
        { value: 'en' as const, label: 'English' },
    ];

    const dynamicStyles = {
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerTitle: {
            fontSize: 17,
            fontWeight: '600' as const,
            color: colors.text,
        },
        section: {
            backgroundColor: colors.card,
            marginTop: 20,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: '600' as const,
            color: colors.textSecondary,
            marginBottom: 12,
        },
        optionText: {
            fontSize: 15,
            color: colors.text,
        },
        optionButton: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
        },
        row: {
            flexDirection: 'row' as const,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
            paddingVertical: 8,
        },
        rowLabel: {
            fontSize: 16,
            color: colors.text,
        },
    };

    return (
        <SafeAreaView style={dynamicStyles.container}>
            {/* Header */}
            <View style={dynamicStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ fontSize: 16, color: colors.primary }}>←</Text>
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle}>{t.settings}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView>
                {/* Language Section */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>{t.language}</Text>
                    <View style={styles.optionGroup}>
                        {languages.map(item => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    dynamicStyles.optionButton,
                                    language === item.value && {
                                        borderColor: colors.primary,
                                        backgroundColor: colors.primary
                                    }
                                ]}
                                onPress={() => setLanguage(item.value)}
                            >
                                <Text style={[
                                    dynamicStyles.optionText,
                                    language === item.value && { color: '#fff', fontWeight: '600' }
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Dark Mode Section */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>{t.appearance}</Text>
                    <View style={dynamicStyles.row}>
                        <Text style={dynamicStyles.rowLabel}>{t.darkMode}</Text>
                        <Switch
                            value={isDarkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#ccc', true: colors.primary }}
                            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Theme Color Section */}
                <View style={dynamicStyles.section}>
                    <Text style={dynamicStyles.sectionTitle}>{t.themeColor}</Text>
                    <View style={styles.colorGrid}>
                        {THEME_COLORS.map(item => (
                            <TouchableOpacity
                                key={item.name}
                                style={[
                                    styles.colorButton,
                                    { backgroundColor: item.color },
                                    themeColorName === item.name && styles.colorButtonSelected
                                ]}
                                onPress={() => setThemeColor(item.name)}
                            >
                                {themeColorName === item.name && (
                                    <Text style={styles.colorCheck}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    optionGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorButtonSelected: {
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    colorCheck: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
