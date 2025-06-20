export type Theme = 'light' | 'dark' | 'system';

export const themes = ['light', 'dark', 'system'] as const;

export interface ThemeConfig {
  name: Theme;
  label: string;
  icon: string;
}

export const themeConfig: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    label: 'Light',
    icon: '☀️',
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    icon: '🌙',
  },
  system: {
    name: 'system',
    label: 'System',
    icon: '💻',
  },
};

export const tokens = {
  colors: {
    primary: {
      light: '142.1 76.2% 36.3%',
      dark: '142.1 70.6% 45.3%',
    },
    secondary: {
      light: '220 14.3% 95.9%',
      dark: '217.2 32.6% 17.5%',
    },
    background: {
      light: '0 0% 100%',
      dark: '222.2 84% 4.9%',
    },
    foreground: {
      light: '222.2 84% 4.9%',
      dark: '210 20% 98%',
    },
    muted: {
      light: '220 14.3% 95.9%',
      dark: '217.2 32.6% 17.5%',
    },
    accent: {
      light: '220 14.3% 95.9%',
      dark: '217.2 32.6% 17.5%',
    },
    destructive: {
      light: '0 84.2% 60.2%',
      dark: '0 62.8% 30.6%',
    },
    border: {
      light: '220 13% 91%',
      dark: '217.2 32.6% 17.5%',
    },
  },
  radius: {
    small: '0.3rem',
    medium: '0.5rem',
    large: '0.7rem',
    round: '9999px',
  },
  animation: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
}; 