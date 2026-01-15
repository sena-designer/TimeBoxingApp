import { format, parse, differenceInMinutes, addMinutes } from 'date-fns';
import { TIMELINE_START_HOUR, HOUR_HEIGHT } from '../constants/categories';

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

// Format date for display (月/日 (曜日))
export const formatDisplayDate = (date: Date): string => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${format(date, 'M/d')} (${days[date.getDay()]})`;
};

// Parse time string (HH:MM) to minutes from midnight
export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Convert minutes from midnight to time string (HH:MM)
export const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Calculate duration in minutes between two time strings
export const calculateDuration = (startTime: string, endTime: string): number => {
    return timeToMinutes(endTime) - timeToMinutes(startTime);
};

// Format duration for display (e.g., "1時間30分")
export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
        return `${hours}時間${mins}分`;
    } else if (hours > 0) {
        return `${hours}時間`;
    } else {
        return `${mins}分`;
    }
};

// Format seconds to MM:SS
export const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Calculate Y position for timeline based on time
export const getTimelinePosition = (time: string): number => {
    const minutes = timeToMinutes(time);
    const startMinutes = TIMELINE_START_HOUR * 60;
    const offsetMinutes = minutes - startMinutes;
    return (offsetMinutes / 60) * HOUR_HEIGHT;
};

// Calculate height for a time block
export const getBlockHeight = (startTime: string, endTime: string): number => {
    const duration = calculateDuration(startTime, endTime);
    return (duration / 60) * HOUR_HEIGHT;
};

// Generate unique ID
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate that end time is after start time
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
    return timeToMinutes(endTime) > timeToMinutes(startTime);
};
