import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeBox, Category, RepeatType } from '../types';

const STORAGE_KEY = 'timeboxes';

// Get all time boxes
export const getAllTimeBoxes = async (): Promise<TimeBox[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error loading time boxes:', error);
        return [];
    }
};

// Get time boxes for a specific date (including recurring tasks)
export const getTimeBoxesByDate = async (date: string): Promise<TimeBox[]> => {
    const allBoxes = await getAllTimeBoxes();
    const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    const result: TimeBox[] = [];

    for (const box of allBoxes) {
        // Direct match for this date
        if (box.date === date) {
            result.push(box);
            continue;
        }

        // Check recurring tasks
        if (box.repeat && box.repeat !== 'none') {
            const boxDate = new Date(box.date);
            const targetDate = new Date(date);

            // Only show recurring tasks for future dates from the original
            if (targetDate >= boxDate) {
                let shouldShow = false;

                switch (box.repeat) {
                    case 'daily':
                        shouldShow = true;
                        break;
                    case 'weekdays':
                        shouldShow = isWeekday;
                        break;
                    case 'weekly':
                        shouldShow = targetDate.getDay() === boxDate.getDay();
                        break;
                }

                if (shouldShow && box.date !== date) {
                    // Create a virtual instance for this date
                    result.push({
                        ...box,
                        id: `${box.id}_${date}`,
                        date: date,
                        status: 'not_started',
                        repeatParentId: box.id,
                    });
                }
            }
        }
    }

    return result.sort((a, b) => a.startTime.localeCompare(b.startTime));
};

// Check if a time slot is occupied (excluding a specific timeBox by id)
export const isSlotOccupied = async (
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
): Promise<boolean> => {
    const boxes = await getTimeBoxesByDate(date);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return boxes.some(box => {
        if (excludeId && (box.id === excludeId || box.repeatParentId === excludeId)) return false;

        const boxStart = timeToMinutes(box.startTime);
        const boxEnd = timeToMinutes(box.endTime);

        // Check for overlap
        return (startMinutes < boxEnd && endMinutes > boxStart);
    });
};

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Save a time box (create or update)
export const saveTimeBox = async (timeBox: TimeBox): Promise<void> => {
    try {
        const allBoxes = await getAllTimeBoxes();
        const existingIndex = allBoxes.findIndex(box => box.id === timeBox.id);

        if (existingIndex >= 0) {
            allBoxes[existingIndex] = { ...timeBox, updatedAt: new Date().toISOString() };
        } else {
            allBoxes.push(timeBox);
        }

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allBoxes));
    } catch (error) {
        console.error('Error saving time box:', error);
        throw error;
    }
};

// Delete a time box
export const deleteTimeBox = async (id: string): Promise<void> => {
    try {
        const allBoxes = await getAllTimeBoxes();
        const filtered = allBoxes.filter(box => box.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting time box:', error);
        throw error;
    }
};

// Update time box status
export const updateTimeBoxStatus = async (
    id: string,
    status: TimeBox['status'],
    memo?: string
): Promise<void> => {
    try {
        const allBoxes = await getAllTimeBoxes();
        // Handle recurring task instances (format: parentId_date)
        const parentId = id.includes('_') ? id.split('_')[0] : id;
        const index = allBoxes.findIndex(box => box.id === parentId || box.id === id);

        if (index >= 0) {
            allBoxes[index] = {
                ...allBoxes[index],
                status,
                memo: memo ?? allBoxes[index].memo,
                updatedAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allBoxes));
        }
    } catch (error) {
        console.error('Error updating time box status:', error);
        throw error;
    }
};

