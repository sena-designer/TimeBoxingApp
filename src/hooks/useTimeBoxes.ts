import { useState, useEffect, useCallback } from 'react';
import { TimeBox, DaySummary } from '../types';
import {
    getTimeBoxesByDate,
    saveTimeBox,
    deleteTimeBox,
    updateTimeBoxStatus
} from '../storage/timeBoxStorage';
import { formatDate, calculateDuration } from '../utils/timeUtils';

export const useTimeBoxes = (date: Date) => {
    const [timeBoxes, setTimeBoxes] = useState<TimeBox[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const dateString = formatDate(date);

    const loadTimeBoxes = useCallback(async () => {
        setLoading(true);
        try {
            const boxes = await getTimeBoxesByDate(dateString);
            setTimeBoxes(boxes);
        } catch (error) {
            console.error('Error loading time boxes:', error);
        } finally {
            setLoading(false);
        }
    }, [dateString]);

    useEffect(() => {
        loadTimeBoxes();
    }, [loadTimeBoxes, refreshKey]);

    const addTimeBox = async (timeBox: Omit<TimeBox, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const newTimeBox: TimeBox = {
            ...timeBox,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            createdAt: now,
            updatedAt: now,
        };
        await saveTimeBox(newTimeBox);
        await loadTimeBoxes();
    };

    const updateTimeBox = async (timeBox: TimeBox) => {
        await saveTimeBox(timeBox);
        await loadTimeBoxes();
    };

    const removeTimeBox = async (id: string) => {
        await deleteTimeBox(id);
        await loadTimeBoxes();
    };

    const setStatus = async (id: string, status: TimeBox['status'], memo?: string) => {
        await updateTimeBoxStatus(id, status, memo);
        await loadTimeBoxes();
    };

    // Force refresh function
    const refresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Calculate summary
    const summary: DaySummary = {
        totalBlocks: timeBoxes.length,
        completedBlocks: timeBoxes.filter(box => box.status === 'completed').length,
        totalFocusMinutes: timeBoxes
            .filter(box => box.status === 'completed')
            .reduce((total, box) => total + calculateDuration(box.startTime, box.endTime), 0),
    };

    return {
        timeBoxes,
        loading,
        addTimeBox,
        updateTimeBox,
        removeTimeBox,
        setStatus,
        summary,
        refresh,
    };
};
