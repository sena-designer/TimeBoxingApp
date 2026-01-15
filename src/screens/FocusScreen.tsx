import React, { useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Modal
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../../App';
import { useTimer } from '../hooks/useTimer';
import { useI18n } from '../hooks/useI18n';
import { formatCountdown } from '../utils/timeUtils';
import { getCategoryColor } from '../constants/categories';

type Props = NativeStackScreenProps<RootStackParamList, 'Focus'>;

// Custom confirm dialog for web compatibility
const ConfirmDialog: React.FC<{
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ visible, title, message, confirmText, cancelText, destructive, onConfirm, onCancel }) => {
    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={dialogStyles.overlay}>
                <View style={dialogStyles.container}>
                    <Text style={dialogStyles.title}>{title}</Text>
                    <Text style={dialogStyles.message}>{message}</Text>
                    <View style={dialogStyles.buttons}>
                        <TouchableOpacity style={dialogStyles.cancelButton} onPress={onCancel}>
                            <Text style={dialogStyles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[dialogStyles.confirmButton, destructive && dialogStyles.destructiveButton]}
                            onPress={onConfirm}
                        >
                            <Text style={[dialogStyles.confirmText, destructive && dialogStyles.destructiveText]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
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
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: '#666',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#4A90D9',
        alignItems: 'center',
    },
    confirmText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    destructiveButton: {
        backgroundColor: '#DC2626',
    },
    destructiveText: {
        color: '#fff',
    },
});

export const FocusScreen: React.FC<Props> = ({ navigation, route }) => {
    const { timeBox } = route.params;
    const { t } = useI18n();
    const [showStopDialog, setShowStopDialog] = useState(false);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);

    // Keep screen awake during focus mode
    useKeepAwake();

    const navigateToResult = useCallback((earlyComplete?: boolean) => {
        navigation.replace('Result', { timeBox, earlyComplete });
    }, [navigation, timeBox]);

    const handleComplete = useCallback(() => {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
            // Haptics not available on web
        }
        navigateToResult();
    }, [navigateToResult]);

    const {
        remainingSeconds,
        totalSeconds,
        isRunning,
        isPaused,
        progress,
        start,
        pause,
        resume,
        stop
    } = useTimer({
        startTime: timeBox.startTime,
        endTime: timeBox.endTime,
        onComplete: handleComplete,
    });

    useEffect(() => {
        start();
        return () => stop();
    }, []);

    const handlePauseResume = () => {
        if (isPaused) {
            resume();
        } else {
            pause();
        }
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {
            // Haptics not available on web
        }
    };

    const handleStop = () => {
        setShowStopDialog(true);
    };

    const confirmStop = () => {
        setShowStopDialog(false);
        stop();
        navigateToResult();
    };

    const handleCompleteEarly = () => {
        setShowCompleteDialog(true);
    };

    const confirmCompleteEarly = () => {
        setShowCompleteDialog(false);
        stop();
        navigateToResult(true);
    };

    const categoryColor = getCategoryColor(timeBox.category);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: categoryColor }]}>
            <StatusBar barStyle="light-content" />

            {/* Stop Confirmation Dialog */}
            <ConfirmDialog
                visible={showStopDialog}
                title={t.stopConfirmTitle}
                message={t.stopConfirmMessage}
                confirmText={t.stopAndEnd}
                cancelText={t.cancel}
                destructive
                onConfirm={confirmStop}
                onCancel={() => setShowStopDialog(false)}
            />

            {/* Complete Early Confirmation Dialog */}
            <ConfirmDialog
                visible={showCompleteDialog}
                title={t.earlyCompleteTitle}
                message={t.earlyCompleteMessage}
                confirmText={t.complete}
                cancelText={t.cancel}
                onConfirm={confirmCompleteEarly}
                onCancel={() => setShowCompleteDialog(false)}
            />

            {/* Task Name */}
            <View style={styles.taskContainer}>
                <Text style={styles.taskName} numberOfLines={2}>
                    {timeBox.title}
                </Text>
            </View>

            {/* Timer Display */}
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                    {formatCountdown(remainingSeconds)}
                </Text>
                {isPaused && (
                    <Text style={styles.pausedText}>{t.paused}</Text>
                )}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progress}%` }
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {Math.round(progress)}%
                </Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleStop}
                >
                    <Text style={styles.secondaryButtonText}>{t.stop}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handlePauseResume}
                >
                    <Text style={styles.primaryButtonText}>
                        {isPaused ? t.resume : t.pause}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleCompleteEarly}
                >
                    <Text style={styles.secondaryButtonText}>{t.complete}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    taskContainer: {
        alignItems: 'center',
        paddingTop: 40,
    },
    taskName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 96,
        fontWeight: '200',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    pausedText: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 8,
    },
    progressContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    progressBackground: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 8,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        paddingBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        minWidth: 120,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 25,
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
});
