import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { addDays, subDays } from 'date-fns';
import { RootStackParamList } from '../../App';
import { Timeline } from '../components/Timeline';
import { useTimeBoxes } from '../hooks/useTimeBoxes';
import { useI18n } from '../hooks/useI18n';
import { formatDate } from '../utils/timeUtils';
import { TimeBox } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DayView'>;

export const DayViewScreen: React.FC<Props> = ({ navigation }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { timeBoxes, loading, summary, refresh } = useTimeBoxes(currentDate);
    const { t, language } = useI18n();

    // Refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const goToPreviousDay = () => {
        setCurrentDate(prev => subDays(prev, 1));
    };

    const goToNextDay = () => {
        setCurrentDate(prev => addDays(prev, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleTimeBoxPress = (timeBox: TimeBox) => {
        navigation.navigate('Edit', {
            timeBoxId: timeBox.id,
            date: formatDate(currentDate)
        });
    };

    const handleStartFocus = (timeBox: TimeBox) => {
        navigation.navigate('Focus', {
            timeBoxId: timeBox.id,
            timeBox
        });
    };

    const handleAddNew = () => {
        navigation.navigate('Edit', {
            date: formatDate(currentDate)
        });
    };

    const handleOpenSettings = () => {
        navigation.navigate('Settings');
    };

    const isToday = formatDate(currentDate) === formatDate(new Date());

    // Format date based on language
    const formatDisplayDate = (date: Date): string => {
        if (language === 'ja') {
            const days = ['日', '月', '火', '水', '木', '金', '土'];
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${month}/${day} (${days[date.getDay()]})`;
        } else {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()} (${days[date.getDay()]})`;
        }
    };

    // Format duration based on language
    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (language === 'ja') {
            if (hours > 0 && mins > 0) {
                return `${hours}${t.hour}${mins}${t.minutes}`;
            } else if (hours > 0) {
                return `${hours}${t.hour}`;
            } else {
                return `${mins}${t.minutes}`;
            }
        } else {
            if (hours > 0 && mins > 0) {
                return `${hours}${hours > 1 ? t.hours : t.hour} ${mins}${t.minutes}`;
            } else if (hours > 0) {
                return `${hours} ${hours > 1 ? t.hours : t.hour}`;
            } else {
                return `${mins} ${t.minutes}`;
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.navButton} onPress={goToPreviousDay}>
                    <Text style={styles.navButtonText}>◀</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToToday}>
                    <Text style={[styles.dateText, isToday && styles.todayText]}>
                        {formatDisplayDate(currentDate)}
                    </Text>
                    {!isToday && (
                        <Text style={styles.todayHint}>{t.tapToGoToday}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={goToNextDay}>
                    <Text style={styles.navButtonText}>▶</Text>
                </TouchableOpacity>
            </View>

            {/* Timeline */}
            <Timeline
                timeBoxes={timeBoxes}
                onTimeBoxPress={handleTimeBoxPress}
                onStartFocus={handleStartFocus}
            />

            {/* Summary */}
            <View style={styles.summary}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>{t.completed}</Text>
                    <Text style={styles.summaryValue}>
                        {summary.completedBlocks}/{summary.totalBlocks}
                    </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>{t.focusTime}</Text>
                    <Text style={styles.summaryValue}>
                        {formatDuration(summary.totalFocusMinutes)}
                    </Text>
                </View>
            </View>

            {/* Settings Button */}
            <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
                <Text style={styles.settingsButtonText}>⚙</Text>
            </TouchableOpacity>

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    navButton: {
        padding: 12,
    },
    navButtonText: {
        fontSize: 18,
        color: '#4A90D9',
    },
    dateText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    todayText: {
        color: '#4A90D9',
    },
    todayHint: {
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
        marginTop: 2,
    },
    summary: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#eee',
        marginHorizontal: 16,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    settingsButton: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    settingsButtonText: {
        fontSize: 24,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A90D9',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4A90D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    addButtonText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '300',
        marginTop: -2,
    },
});
