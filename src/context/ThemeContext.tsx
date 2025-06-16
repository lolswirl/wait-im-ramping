import { createContext, useContext, useState, useEffect } from 'react';

// Define the theme context
const ThemeContext = createContext({
  themeMode: 'dark', // default theme mode
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  // Check localStorage for saved theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      setThemeMode(savedTheme === 'dark' ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    // Save the theme in localStorage
    localStorage.setItem('themeMode', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
