import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeBox, Status } from '../types';
import { getCategoryColor } from '../constants/categories';
import { calculateDuration } from '../utils/timeUtils';
import { useI18n, getCategoryLabel } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

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
    const { colors } = useTheme();
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
            style={[
                styles.container,
                {
                    borderLeftColor: categoryColor,
                    backgroundColor: colors.card,
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Header: Time and Status */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                        {timeBox.title}
                    </Text>
                    <Text style={[styles.status, { color: getStatusColor(timeBox.status) }]}>
                        {STATUS_ICONS[timeBox.status]}
                    </Text>
                </View>
            </View>

            {/* Footer: Category, Time, and Start Button */}
            <View style={styles.footer}>
                <View style={styles.infoRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                        <Text style={[styles.categoryText, { color: categoryColor }]}>
                            {getCategoryLabel(timeBox.category, t)}
                        </Text>
                    </View>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>
                        {timeBox.startTime}-{timeBox.endTime}
                    </Text>
                </View>

                {timeBox.status === 'not_started' && onStart && (
                    <TouchableOpacity
                        style={[styles.startButton, { backgroundColor: colors.primary }]}
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
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    header: {
        flexShrink: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 1,
    },
    time: {
        fontSize: 11,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '500',
    },
    startButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        flexShrink: 0,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
});
