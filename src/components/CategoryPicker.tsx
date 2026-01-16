import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Category } from '../types';
import { CATEGORIES } from '../constants/categories';
import { useI18n, getCategoryLabel } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

interface CategoryPickerProps {
    selected: Category;
    onSelect: (category: Category) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ selected, onSelect }) => {
    const { t } = useI18n();
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text }]}>{t.category}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {CATEGORIES.map(category => (
                    <TouchableOpacity
                        key={category.key}
                        style={[
                            styles.categoryButton,
                            {
                                backgroundColor: selected === category.key
                                    ? category.color
                                    : category.color + '20',
                                borderColor: category.color,
                            }
                        ]}
                        onPress={() => onSelect(category.key)}
                    >
                        <Text style={[
                            styles.categoryText,
                            { color: selected === category.key ? '#fff' : category.color }
                        ]}>
                            {getCategoryLabel(category.key, t)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    scrollContent: {
        paddingHorizontal: 4,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
