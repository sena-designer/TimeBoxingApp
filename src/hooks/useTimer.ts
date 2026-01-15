import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateDuration, timeToMinutes } from '../utils/timeUtils';

interface UseTimerProps {
    startTime: string;
    endTime: string;
    onComplete?: () => void;
}

interface UseTimerReturn {
    remainingSeconds: number;
    totalSeconds: number;
    isRunning: boolean;
    isPaused: boolean;
    progress: number;
    start: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
}

export const useTimer = ({ startTime, endTime, onComplete }: UseTimerProps): UseTimerReturn => {
    const totalSeconds = calculateDuration(startTime, endTime) * 60;
    const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const start = useCallback(() => {
        clearTimer();
        setRemainingSeconds(totalSeconds);
        setIsRunning(true);
        setIsPaused(false);

        intervalRef.current = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    onCompleteRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [totalSeconds, clearTimer]);

    const pause = useCallback(() => {
        clearTimer();
        setIsPaused(true);
    }, [clearTimer]);

    const resume = useCallback(() => {
        if (!isPaused) return;

        setIsPaused(false);

        intervalRef.current = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    onCompleteRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [isPaused, clearTimer]);

    const stop = useCallback(() => {
        clearTimer();
        setIsRunning(false);
        setIsPaused(false);
        setRemainingSeconds(totalSeconds);
    }, [clearTimer, totalSeconds]);

    useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    const progress = totalSeconds > 0
        ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
        : 0;

    return {
        remainingSeconds,
        totalSeconds,
        isRunning,
        isPaused,
        progress,
        start,
        pause,
        resume,
        stop,
    };
};
