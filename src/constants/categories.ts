import { Category } from '../types';

export interface CategoryInfo {
    key: Category;
    label: string;
    color: string;
}

export const CATEGORIES: CategoryInfo[] = [
    { key: 'work', label: '仕事', color: '#4A90D9' },
    { key: 'study', label: '勉強', color: '#7C4DFF' },
    { key: 'exercise', label: '運動', color: '#4CAF50' },
    { key: 'housework', label: '家事', color: '#FF9800' },
    { key: 'rest', label: '休憩', color: '#00BCD4' },
    { key: 'other', label: 'その他', color: '#9E9E9E' },
];

export const getCategoryColor = (category: Category): string => {
    const found = CATEGORIES.find(c => c.key === category);
    return found?.color ?? '#9E9E9E';
};

export const getCategoryLabel = (category: Category): string => {
    const found = CATEGORIES.find(c => c.key === category);
    return found?.label ?? 'その他';
};

// Timeline hours (0:00 - 24:00)
export const TIMELINE_START_HOUR = 0;
export const TIMELINE_END_HOUR = 24;

// Hour height in pixels for timeline
export const HOUR_HEIGHT = 80;
