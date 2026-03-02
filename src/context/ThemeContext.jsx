import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Default Theme (can be overridden by backend) ───────────────────────────
const defaultTheme = {
  primary: '#0ea5e9',       // Sky blue
  primaryDark: '#0369a1',
  primaryLight: '#e0f2fe',
  secondary: '#10b981',     // Emerald
  secondaryDark: '#059669',
  accent: '#f59e0b',        // Amber
  danger: '#ef4444',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  text: '#0f172a',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  border: '#e2e8f0',
  gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #075985 100%)',
  gradientHero: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 50%, #0ea5e9 100%)',
  borderRadius: '12px',
  borderRadiusLg: '20px',
  shadow: '0 4px 24px rgba(14, 165, 233, 0.12)',
  shadowHover: '0 8px 40px rgba(14, 165, 233, 0.25)',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
};

const ThemeContext = createContext({ theme: defaultTheme, setTheme: () => {} });

/**
 * ThemeProvider – wraps the app and injects CSS variables for dynamic theming.
 * To override from backend, fetch your theme JSON and call setTheme(backendTheme).
 *
 * Example backend shape:
 * { primary: '#...', secondary: '#...', ... }
 */
export function ThemeProvider({ children, initialTheme = {} }) {
  const [theme, setThemeState] = useState({ ...defaultTheme, ...initialTheme });

  // Inject CSS custom properties on every theme change
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      const cssKey = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssKey, value);
    });
  }, [theme]);

  const setTheme = (partial) =>
    setThemeState((prev) => ({ ...prev, ...partial }));

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export { defaultTheme };
