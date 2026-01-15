import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TimeBox } from '../types';
import { TimeBlock } from './TimeBlock';
import { TIMELINE_START_HOUR, TIMELINE_END_HOUR, HOUR_HEIGHT } from '../constants/categories';
import { useTheme } from '../hooks/useTheme';

interface TimelineProps {
    timeBoxes: TimeBox[];
    onTimeBoxPress: (timeBox: TimeBox) => void;
    onStartFocus: (timeBox: TimeBox) => void;
}

// Helper to convert time string to minutes from midnight
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Padding for TimeBlock margins (vertical)
const BLOCK_VERTICAL_PADDING = 4;

export const Timeline: React.FC<TimelineProps> = ({
    timeBoxes,
    onTimeBoxPress,
    onStartFocus
}) => {
    const { colors } = useTheme();

    // Generate hour labels (0-23 only, not 24)
    const hours: number[] = [];
    for (let h = TIMELINE_START_HOUR; h < TIMELINE_END_HOUR; h++) {
        hours.push(h);
    }

    // Calculate total timeline height
    const totalHeight = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * HOUR_HEIGHT;

    // Calculate position and height for a timeBox
    const getTimeBoxStyle = (timeBox: TimeBox) => {
        const startMinutes = timeToMinutes(timeBox.startTime);
        const endMinutes = timeToMinutes(timeBox.endTime);
        const durationMinutes = endMinutes - startMinutes;

        const top = ((startMinutes - TIMELINE_START_HOUR * 60) / 60) * HOUR_HEIGHT + BLOCK_VERTICAL_PADDING;
        const height = (durationMinutes / 60) * HOUR_HEIGHT - (BLOCK_VERTICAL_PADDING * 2);

        return {
            position: 'absolute' as const,
            top,
            left: 50,
            right: 8,
            height: Math.max(height, 36), // Minimum height for readability
        };
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[styles.contentContainer, { height: totalHeight }]}
        >
            {/* Hour rows with grid lines */}
            {hours.map((hour) => (
                <View
                    key={hour}
                    style={[
                        styles.hourRow,
                        { top: (hour - TIMELINE_START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }
                    ]}
                >
                    <View style={styles.timeLabelContainer}>
                        <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                            {String(hour).padStart(2, '0')}:00
                        </Text>
                    </View>
                    <View style={styles.hourSlot}>
                        <View style={[styles.hourLine, { backgroundColor: colors.border }]} />
                    </View>
                </View>
            ))}

            {/* TimeBoxes positioned absolutely based on their time */}
            {timeBoxes.map(timeBox => (
                <View key={timeBox.id} style={getTimeBoxStyle(timeBox)}>
                    <TimeBlock
                        timeBox={timeBox}
                        onPress={() => onTimeBoxPress(timeBox)}
                        onStart={() => onStartFocus(timeBox)}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        position: 'relative',
    },
    hourRow: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
    },
    timeLabelContainer: {
        width: 50,
        paddingTop: 0,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 11,
        fontWeight: '500',
    },
    hourSlot: {
        flex: 1,
    },
    hourLine: {
        height: 1,
    },
});
