/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'em_studio_theme_v1';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'dark';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('dark', 'light');
    root.classList.add(theme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};

interface ThemeToggleProps {
  variant?: 'segmented' | 'compact';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'segmented',
  className = '',
}) => {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
          theme === 'dark'
            ? 'bg-[#121212] hover:bg-[#181818] border-[#27272A] text-[#A1A1AA] hover:text-white'
            : 'bg-[#FFFFFF] hover:bg-[#F3F1EC] border-[#E2DFD7] text-[#575653] hover:text-[#141413]'
        } ${className}`}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-medium">Light</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-[#B89225]" />
            <span className="text-xs font-medium">Dark</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme mode selector"
      className={`inline-flex items-center p-1 rounded-lg border transition-colors ${
        theme === 'dark'
          ? 'bg-[#121212] border-[#27272A]'
          : 'bg-[#EFECE6] border-[#E2DFD7]'
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        title="Dark Mode (Obsidian Darkroom)"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
          theme === 'dark'
            ? 'bg-[#242424] text-[#D4AF37] shadow-sm'
            : 'text-[#575653] hover:text-[#141413]'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        title="Light Mode (Editorial Alabaster)"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
          theme === 'light'
            ? 'bg-[#FFFFFF] text-[#B89225] shadow-sm font-semibold'
            : 'text-[#A1A1AA] hover:text-white'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Light</span>
      </button>
    </div>
  );
};
