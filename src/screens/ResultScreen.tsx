import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Status } from '../types';
import { updateTimeBoxStatus } from '../storage/timeBoxStorage';
import { getCategoryColor } from '../constants/categories';
import { useI18n } from '../hooks/useI18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
    const { timeBox, earlyComplete } = route.params;
    const { t } = useI18n();

    const RESULT_OPTIONS: { status: Status; label: string; emoji: string }[] = [
        { status: 'completed', label: t.completedStatus, emoji: '✓' },
        { status: 'partial', label: t.partialStatus, emoji: '△' },
        { status: 'skipped', label: t.skippedStatus, emoji: '✗' },
    ];

    const [selectedStatus, setSelectedStatus] = useState<Status>(
        earlyComplete ? 'completed' : 'completed'
    );
    const [memo, setMemo] = useState('');

    const handleSave = async () => {
        try {
            await updateTimeBoxStatus(timeBox.id, selectedStatus, memo.trim() || undefined);
            navigation.popToTop();
        } catch (error) {
            console.error('Failed to save result:', error);
        }
    };

    const categoryColor = getCategoryColor(timeBox.category);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{t.greatJob}</Text>
                    <Text style={styles.taskName}>{timeBox.title}</Text>
                </View>

                {/* Result Options */}
                <View style={styles.optionsContainer}>
                    <Text style={styles.sectionTitle}>{t.executionStatus}</Text>
                    {RESULT_OPTIONS.map(option => (
                        <TouchableOpacity
                            key={option.status}
                            style={[
                                styles.optionButton,
                                selectedStatus === option.status && {
                                    backgroundColor: categoryColor,
                                    borderColor: categoryColor
                                }
                            ]}
                            onPress={() => setSelectedStatus(option.status)}
                        >
                            <Text style={[
                                styles.optionEmoji,
                                selectedStatus === option.status && styles.optionEmojiSelected
                            ]}>
                                {option.emoji}
                            </Text>
                            <Text style={[
                                styles.optionLabel,
                                selectedStatus === option.status && styles.optionLabelSelected
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Memo Input */}
                <View style={styles.memoContainer}>
                    <Text style={styles.sectionTitle}>{t.memo}</Text>
                    <TextInput
                        style={styles.memoInput}
                        value={memo}
                        onChangeText={setMemo}
                        placeholder={t.memoPlaceholder}
                        placeholderTextColor="#999"
                        maxLength={100}
                        multiline
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: categoryColor }]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>{t.save}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    taskName: {
        fontSize: 16,
        color: '#666',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    optionsContainer: {
        marginBottom: 24,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    optionEmoji: {
        fontSize: 24,
        marginRight: 16,
        color: '#666',
    },
    optionEmojiSelected: {
        color: '#fff',
    },
    optionLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    optionLabelSelected: {
        color: '#fff',
    },
    memoContainer: {
        marginBottom: 32,
    },
    memoInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    saveButton: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});
