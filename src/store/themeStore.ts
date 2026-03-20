import create from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false,
  toggle: () =>
    set((s) => {
      const next = !s.isDark;
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
      }
      return { isDark: next };
    }),
  setDark: (v: boolean) =>
    set(() => {
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', v);
        localStorage.setItem('theme', v ? 'dark' : 'light');
      }
      return { isDark: v };
    }),
}));
