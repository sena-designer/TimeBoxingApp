import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'ja' | 'en';

interface Translations {
    // Common
    save: string;
    cancel: string;
    delete: string;
    ok: string;
    error: string;

    // Day View
    today: string;
    tapToGoToday: string;
    completed: string;
    focusTime: string;
    minutes: string;
    hour: string;
    hours: string;

    // Edit Screen
    newTask: string;
    edit: string;
    taskName: string;
    taskNamePlaceholder: string;
    startTime: string;
    endTime: string;
    category: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    enterTaskName: string;
    endTimeAfterStart: string;
    saveFailed: string;
    deleteFailed: string;
    slotOccupied: string;

    // Categories
    work: string;
    study: string;
    exercise: string;
    housework: string;
    rest: string;
    other: string;

    // Focus Screen
    stopConfirmTitle: string;
    stopConfirmMessage: string;
    stopAndEnd: string;
    earlyCompleteTitle: string;
    earlyCompleteMessage: string;
    complete: string;
    paused: string;
    pause: string;
    resume: string;
    stop: string;
    start: string;

    // Result Screen
    greatJob: string;
    executionStatus: string;
    completedStatus: string;
    partialStatus: string;
    skippedStatus: string;
    memo: string;
    memoPlaceholder: string;

    // Status
    notStarted: string;
    inProgress: string;

    // Settings
    settings: string;
    language: string;

    // Repeat
    repeat: string;
    repeatNone: string;
    repeatDaily: string;
    repeatWeekdays: string;
    repeatWeekly: string;
}

const translations: Record<Language, Translations> = {
    ja: {
        // Common
        save: '保存',
        cancel: 'キャンセル',
        delete: '削除',
        ok: 'OK',
        error: 'エラー',

        // Day View
        today: '今日',
        tapToGoToday: 'タップで今日へ',
        completed: '完了',
        focusTime: '集中時間',
        minutes: '分',
        hour: '時間',
        hours: '時間',

        // Edit Screen
        newTask: '新規作成',
        edit: '編集',
        taskName: 'タスク名',
        taskNamePlaceholder: '例: 企画書作成',
        startTime: '開始時刻',
        endTime: '終了時刻',
        category: 'カテゴリ',
        deleteConfirmTitle: '削除確認',
        deleteConfirmMessage: 'このタイムボックスを削除しますか？',
        enterTaskName: 'タスク名を入力してください',
        endTimeAfterStart: '終了時刻は開始時刻より後に設定してください',
        saveFailed: '保存に失敗しました',
        deleteFailed: '削除に失敗しました',
        slotOccupied: 'この時間帯には既にタスクがあります',

        // Categories
        work: '仕事',
        study: '勉強',
        exercise: '運動',
        housework: '家事',
        rest: '休憩',
        other: 'その他',

        // Focus Screen
        stopConfirmTitle: '中断確認',
        stopConfirmMessage: 'フォーカスモードを中断しますか？',
        stopAndEnd: '中断して終了',
        earlyCompleteTitle: '早期完了',
        earlyCompleteMessage: '予定時間前ですが、完了として記録しますか？',
        complete: '完了',
        paused: '一時停止中',
        pause: '一時停止',
        resume: '再開',
        stop: '中断',
        start: '開始',

        // Result Screen
        greatJob: 'お疲れさまでした！',
        executionStatus: '実行状況',
        completedStatus: '完了した',
        partialStatus: '途中まで',
        skippedStatus: 'できなかった',
        memo: 'メモ（任意）',
        memoPlaceholder: 'ひとことメモ...',

        // Status
        notStarted: '未開始',
        inProgress: '実行中',

        // Settings
        settings: '設定',
        language: '言語',

        // Repeat
        repeat: '繰り返し',
        repeatNone: 'なし',
        repeatDaily: '毎日',
        repeatWeekdays: '平日のみ',
        repeatWeekly: '毎週',
    },
    en: {
        // Common
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        ok: 'OK',
        error: 'Error',

        // Day View
        today: 'Today',
        tapToGoToday: 'Tap to go to today',
        completed: 'Completed',
        focusTime: 'Focus Time',
        minutes: 'min',
        hour: 'hr',
        hours: 'hrs',

        // Edit Screen
        newTask: 'New Task',
        edit: 'Edit',
        taskName: 'Task Name',
        taskNamePlaceholder: 'e.g. Write proposal',
        startTime: 'Start Time',
        endTime: 'End Time',
        category: 'Category',
        deleteConfirmTitle: 'Confirm Delete',
        deleteConfirmMessage: 'Are you sure you want to delete this time box?',
        enterTaskName: 'Please enter a task name',
        endTimeAfterStart: 'End time must be after start time',
        saveFailed: 'Failed to save',
        deleteFailed: 'Failed to delete',
        slotOccupied: 'This time slot already has a task',

        // Categories
        work: 'Work',
        study: 'Study',
        exercise: 'Exercise',
        housework: 'Housework',
        rest: 'Rest',
        other: 'Other',

        // Focus Screen
        stopConfirmTitle: 'Confirm Stop',
        stopConfirmMessage: 'Do you want to stop focus mode?',
        stopAndEnd: 'Stop and End',
        earlyCompleteTitle: 'Complete Early',
        earlyCompleteMessage: 'Complete before scheduled time?',
        complete: 'Complete',
        paused: 'Paused',
        pause: 'Pause',
        resume: 'Resume',
        stop: 'Stop',
        start: 'Start',

        // Result Screen
        greatJob: 'Great job!',
        executionStatus: 'Status',
        completedStatus: 'Completed',
        partialStatus: 'Partial',
        skippedStatus: 'Skipped',
        memo: 'Memo (optional)',
        memoPlaceholder: 'Quick note...',

        // Status
        notStarted: 'Not Started',
        inProgress: 'In Progress',

        // Settings
        settings: 'Settings',
        language: 'Language',

        // Repeat
        repeat: 'Repeat',
        repeatNone: 'None',
        repeatDaily: 'Daily',
        repeatWeekdays: 'Weekdays',
        repeatWeekly: 'Weekly',
    },
};

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LANGUAGE_KEY = 'app_language';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('ja');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
                if (savedLang === 'en' || savedLang === 'ja') {
                    setLanguageState(savedLang);
                }
            } catch (e) {
                console.error('Failed to load settings:', e);
            } finally {
                setLoaded(true);
            }
        };
        loadSettings();
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    };

    if (!loaded) {
        return null;
    }

    return (
        <I18nContext.Provider value={{
            language,
            setLanguage,
            t: translations[language],
        }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
};

export const getCategoryLabel = (category: string, t: Translations): string => {
    const categoryMap: Record<string, keyof Translations> = {
        work: 'work',
        study: 'study',
        exercise: 'exercise',
        housework: 'housework',
        rest: 'rest',
        other: 'other',
    };
    const key = categoryMap[category] || 'other';
    return t[key] as string;
};
