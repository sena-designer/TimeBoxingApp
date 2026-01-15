import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme colors
export const THEME_COLORS = [
    { name: 'blue', color: '#4A90D9' },
    { name: 'purple', color: '#7C4DFF' },
    { name: 'green', color: '#4CAF50' },
    { name: 'orange', color: '#FF9800' },
    { name: 'pink', color: '#E91E63' },
    { name: 'teal', color: '#00BCD4' },
] as const;

export type ThemeColorName = typeof THEME_COLORS[number]['name'];

interface ThemeContextType {
    isDarkMode: boolean;
    setDarkMode: (value: boolean) => void;
    themeColor: string;
    themeColorName: ThemeColorName;
    setThemeColor: (name: ThemeColorName) => void;
    colors: {
        background: string;
        card: string;
        text: string;
        textSecondary: string;
        border: string;
        primary: string;
    };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_MODE_KEY = '@darkMode';
const THEME_COLOR_KEY = '@themeColor';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [themeColorName, setThemeColorName] = useState<ThemeColorName>('blue');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedDarkMode = await AsyncStorage.getItem(DARK_MODE_KEY);
                if (savedDarkMode !== null) {
                    setIsDarkMode(savedDarkMode === 'true');
                }
                const savedColor = await AsyncStorage.getItem(THEME_COLOR_KEY);
                if (savedColor) {
                    setThemeColorName(savedColor as ThemeColorName);
                }
            } catch (e) {
                console.error('Failed to load theme settings:', e);
            } finally {
                setLoaded(true);
            }
        };
        loadSettings();
    }, []);

    const setDarkMode = async (value: boolean) => {
        setIsDarkMode(value);
        await AsyncStorage.setItem(DARK_MODE_KEY, value.toString());
    };

    const setThemeColor = async (name: ThemeColorName) => {
        setThemeColorName(name);
        await AsyncStorage.setItem(THEME_COLOR_KEY, name);
    };

    const themeColor = THEME_COLORS.find(c => c.name === themeColorName)?.color || '#4A90D9';

    const colors = isDarkMode
        ? {
            background: '#121212',
            card: '#1E1E1E',
            text: '#FFFFFF',
            textSecondary: '#AAAAAA',
            border: '#333333',
            primary: themeColor,
        }
        : {
            background: '#f8f9fa',
            card: '#FFFFFF',
            text: '#333333',
            textSecondary: '#666666',
            border: '#EEEEEE',
            primary: themeColor,
        };

    if (!loaded) {
        return null;
    }

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                setDarkMode,
                themeColor,
                themeColorName,
                setThemeColor,
                colors,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
