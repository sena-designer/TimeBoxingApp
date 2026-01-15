// Type definitions for Time Boxing App

export type Category = 'work' | 'study' | 'exercise' | 'housework' | 'rest' | 'other';

export type Status = 'not_started' | 'in_progress' | 'completed' | 'partial' | 'skipped';

export type RepeatType = 'none' | 'daily' | 'weekdays' | 'weekly';

export interface TimeBox {
  id: string;
  date: string;          // YYYY-MM-DD
  title: string;
  startTime: string;     // HH:MM
  endTime: string;       // HH:MM
  category: Category;
  status: Status;
  memo?: string;
  repeat?: RepeatType;
  repeatParentId?: string;  // 繰り返しの親タスクID
  createdAt: string;     // ISO string
  updatedAt: string;     // ISO string
}

export interface DaySummary {
  totalBlocks: number;
  completedBlocks: number;
  totalFocusMinutes: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  work: '仕事',
  study: '勉強',
  exercise: '運動',
  housework: '家事',
  rest: '休憩',
  other: 'その他',
};

export const STATUS_LABELS: Record<Status, string> = {
  not_started: '未開始',
  in_progress: '実行中',
  completed: '完了',
  partial: '途中',
  skipped: 'できなかった',
};
