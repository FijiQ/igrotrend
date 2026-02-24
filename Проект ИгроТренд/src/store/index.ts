import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, translations, Translations, defaultLanguage } from '@/lib/i18n/config';

interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  level: number;
  exp: number;
  coins: number;
  language: Language;
  emailStatus: string;
  role: 'USER' | 'ADMIN' | 'DEVELOPER';
}

interface AppState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  
  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Language
      language: defaultLanguage,
      setLanguage: (lang) => set({ language: lang, t: translations[lang] }),
      t: translations[defaultLanguage],
      
      // Auth
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },
      
      // UI
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      activeTab: 'feed',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'igrotrend-storage',
      partialize: (state) => ({
        language: state.language,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Level system configuration
export const levelConfig = {
  expPerLevel: 100,
  coinsPerLevel: 50,
  levelTitles: {
    1: 'newbie',
    5: 'beginner',
    10: 'intermediate',
    20: 'advanced',
    35: 'expert',
    50: 'master',
    100: 'legend',
  } as Record<number, string>,
};

export const getLevelTitle = (level: number, t: Translations): string => {
  const levels = Object.keys(levelConfig.levelTitles).map(Number).sort((a, b) => b - a);
  for (const l of levels) {
    if (level >= l) {
      const key = levelConfig.levelTitles[l] as keyof typeof t.levels;
      return t.levels[key];
    }
  }
  return t.levels.newbie;
};

export const getExpToNextLevel = (exp: number): number => {
  return levelConfig.expPerLevel - (exp % levelConfig.expPerLevel);
};

// Role helpers
export const isDeveloper = (user: User | null): boolean => {
  return user?.role === 'DEVELOPER';
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'ADMIN' || user?.role === 'DEVELOPER';
};

export const canAccessDevPanel = (user: User | null): boolean => {
  return isDeveloper(user);
};
