import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { TimePicker } from '../components/TimePicker';
import { CategoryPicker } from '../components/CategoryPicker';
import { TimeBox, Category, RepeatType } from '../types';
import {
    getTimeBoxesByDate,
    saveTimeBox,
    deleteTimeBox,
    isSlotOccupied,
} from '../storage/timeBoxStorage';
import { isValidTimeRange, generateId } from '../utils/timeUtils';
import { useI18n } from '../hooks/useI18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;

// Custom alert dialog for web compatibility
const AlertDialog: React.FC<{
    visible: boolean;
    title: string;
    message: string;
    buttons: Array<{
        text: string;
        style?: 'default' | 'cancel' | 'destructive';
        onPress: () => void;
    }>;
    onClose: () => void;
}> = ({ visible, title, message, buttons, onClose }) => {
    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={dialogStyles.overlay}>
                <View style={dialogStyles.container}>
                    <Text style={dialogStyles.title}>{title}</Text>
                    <Text style={dialogStyles.message}>{message}</Text>
                    <View style={dialogStyles.buttons}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    dialogStyles.button,
                                    button.style === 'cancel' && dialogStyles.cancelButton,
                                    button.style === 'destructive' && dialogStyles.destructiveButton,
                                ]}
                                onPress={button.onPress}
                            >
                                <Text style={[
                                    dialogStyles.buttonText,
                                    button.style === 'cancel' && dialogStyles.cancelText,
                                    button.style === 'destructive' && dialogStyles.destructiveText,
                                ]}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const dialogStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        maxWidth: 320,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#4A90D9',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    cancelText: {
        color: '#666',
    },
    destructiveButton: {
        backgroundColor: '#DC2626',
    },
    destructiveText: {
        color: '#fff',
    },
});

export const EditScreen: React.FC<Props> = ({ navigation, route }) => {
    const { timeBoxId, date } = route.params;
    const isNew = !timeBoxId;
    const { t } = useI18n();

    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [category, setCategory] = useState<Category>('work');
    const [repeat, setRepeat] = useState<RepeatType>('none');
    const [loading, setLoading] = useState(!isNew);

    // Dialog states
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Repeat options
    const repeatOptions: { value: RepeatType; label: string }[] = [
        { value: 'none', label: t.repeatNone },
        { value: 'daily', label: t.repeatDaily },
        { value: 'weekdays', label: t.repeatWeekdays },
        { value: 'weekly', label: t.repeatWeekly },
    ];

    // Load existing time box data
    useEffect(() => {
        const loadTimeBox = async () => {
            if (!timeBoxId) return;

            try {
                const boxes = await getTimeBoxesByDate(date);
                const box = boxes.find(b => b.id === timeBoxId || b.repeatParentId === timeBoxId);
                if (box) {
                    setTitle(box.title);
                    setStartTime(box.startTime);
                    setEndTime(box.endTime);
                    setCategory(box.category);
                    setRepeat(box.repeat || 'none');
                }
            } catch (error) {
                console.error('Error loading time box:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTimeBox();
    }, [timeBoxId, date]);

    const showError = (message: string) => {
        setErrorMessage(message);
        setShowErrorDialog(true);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            showError(t.enterTaskName);
            return;
        }

        if (!isValidTimeRange(startTime, endTime)) {
            showError(t.endTimeAfterStart);
            return;
        }

        // Check for slot conflict
        const occupied = await isSlotOccupied(date, startTime, endTime, timeBoxId);
        if (occupied) {
            showError(t.slotOccupied);
            return;
        }

        const now = new Date().toISOString();
        const timeBox: TimeBox = {
            id: timeBoxId || generateId(),
            date,
            title: title.trim(),
            startTime,
            endTime,
            category,
            status: 'not_started',
            repeat: repeat,
            createdAt: now,
            updatedAt: now,
        };

        try {
            await saveTimeBox(timeBox);
            navigation.goBack();
        } catch (error) {
            showError(t.saveFailed);
        }
    };

    const handleDelete = () => {
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        setShowDeleteDialog(false);
        try {
            if (timeBoxId) {
                // For recurring instances, delete the parent
                const parentId = timeBoxId.includes('_') ? timeBoxId.split('_')[0] : timeBoxId;
                await deleteTimeBox(parentId);
            }
            navigation.goBack();
        } catch (error) {
            showError(t.deleteFailed);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Delete Confirmation Dialog */}
            <AlertDialog
                visible={showDeleteDialog}
                title={t.deleteConfirmTitle}
                message={t.deleteConfirmMessage}
                buttons={[
                    { text: t.cancel, style: 'cancel', onPress: () => setShowDeleteDialog(false) },
                    { text: t.delete, style: 'destructive', onPress: confirmDelete },
                ]}
                onClose={() => setShowDeleteDialog(false)}
            />

            {/* Error Dialog */}
            <AlertDialog
                visible={showErrorDialog}
                title={t.error}
                message={errorMessage}
                buttons={[
                    { text: t.ok, style: 'default', onPress: () => setShowErrorDialog(false) },
                ]}
                onClose={() => setShowErrorDialog(false)}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButton}>{t.cancel}</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {isNew ? t.newTask : t.edit}
                    </Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.saveButton}>{t.save}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Title Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t.taskName}</Text>
                        <TextInput
                            style={styles.textInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder={t.taskNamePlaceholder}
                            placeholderTextColor="#999"
                            maxLength={50}
                        />
                    </View>

                    {/* Time Pickers */}
                    <View style={styles.timeRow}>
                        <View style={styles.timePickerWrapper}>
                            <TimePicker
                                label={t.startTime}
                                value={startTime}
                                onChange={setStartTime}
                            />
                        </View>
                        <Text style={styles.timeSeparator}>〜</Text>
                        <View style={styles.timePickerWrapper}>
                            <TimePicker
                                label={t.endTime}
                                value={endTime}
                                onChange={setEndTime}
                            />
                        </View>
                    </View>

                    {/* Category Picker */}
                    <CategoryPicker selected={category} onSelect={setCategory} />

                    {/* Repeat Picker */}
                    <View style={styles.repeatSection}>
                        <Text style={styles.label}>{t.repeat}</Text>
                        <View style={styles.repeatOptions}>
                            {repeatOptions.map(option => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.repeatOption,
                                        repeat === option.value && styles.repeatOptionSelected
                                    ]}
                                    onPress={() => setRepeat(option.value)}
                                >
                                    <Text style={[
                                        styles.repeatOptionText,
                                        repeat === option.value && styles.repeatOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Delete Button (only for existing items) */}
                    {!isNew && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Text style={styles.deleteButtonText}>{t.delete}</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },
    cancelButton: {
        fontSize: 16,
        color: '#666',
    },
    saveButton: {
        fontSize: 16,
        color: '#4A90D9',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    timePickerWrapper: {
        flex: 1,
    },
    timeSeparator: {
        fontSize: 20,
        color: '#666',
        marginHorizontal: 12,
        marginBottom: 20,
    },
    repeatSection: {
        marginTop: 16,
        marginBottom: 24,
    },
    repeatOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    repeatOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    repeatOptionSelected: {
        borderColor: '#4A90D9',
        backgroundColor: '#4A90D9',
    },
    repeatOptionText: {
        fontSize: 14,
        color: '#333',
    },
    repeatOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    deleteButton: {
        marginTop: 40,
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#FEE2E2',
    },
    deleteButtonText: {
        fontSize: 16,
        color: '#DC2626',
        fontWeight: '600',
    },
});
