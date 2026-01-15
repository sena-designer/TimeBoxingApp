import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeBox, Status } from '../types';
import { getCategoryColor } from '../constants/categories';
import { calculateDuration } from '../utils/timeUtils';
import { useI18n, getCategoryLabel } from '../hooks/useI18n';

interface TimeBlockProps {
    timeBox: TimeBox;
    onPress: () => void;
    onStart?: () => void;
}

const STATUS_ICONS: Record<Status, string> = {
    not_started: '○',
    in_progress: '▶',
    completed: '✓',
    partial: '△',
    skipped: '✗',
};

export const TimeBlock: React.FC<TimeBlockProps> = ({ timeBox, onPress, onStart }) => {
    const { t, language } = useI18n();
    const categoryColor = getCategoryColor(timeBox.category);
    const duration = calculateDuration(timeBox.startTime, timeBox.endTime);

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
                return `${hours}h ${mins}m`;
            } else if (hours > 0) {
                return `${hours}h`;
            } else {
                return `${mins}m`;
            }
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { borderLeftColor: categoryColor }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                        {timeBox.startTime} - {timeBox.endTime}
                    </Text>
                    <Text style={styles.duration}>({formatDuration(duration)})</Text>
                </View>
                <Text style={[styles.status, { color: getStatusColor(timeBox.status) }]}>
                    {STATUS_ICONS[timeBox.status]}
                </Text>
            </View>

            <Text style={styles.title} numberOfLines={2}>
                {timeBox.title}
            </Text>

            <View style={styles.footer}>
                <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                    <Text style={[styles.categoryText, { color: categoryColor }]}>
                        {getCategoryLabel(timeBox.category, t)}
                    </Text>
                </View>

                {timeBox.status === 'not_started' && onStart && (
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onStart();
                        }}
                    >
                        <Text style={styles.startButtonText}>{t.start}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const getStatusColor = (status: Status): string => {
    switch (status) {
        case 'completed': return '#4CAF50';
        case 'in_progress': return '#2196F3';
        case 'partial': return '#FF9800';
        case 'skipped': return '#F44336';
        default: return '#9E9E9E';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    duration: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    status: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
    },
    startButton: {
        backgroundColor: '#4A90D9',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
