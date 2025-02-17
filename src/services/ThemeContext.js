import React, { createContext, useState, useContext, useEffect } from 'react';

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { dark,light } from '../styles/ColorSchemes/schemes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(useColorScheme() === "dark");

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };


  const theme = {
    ...isDarkTheme ? { ...MD3DarkTheme, colors:  dark.colors }: { ...MD3LightTheme, colors: light.colors },
    isDarkTheme,
    toggleTheme,
  };


  useEffect(() => {
    const loadTheme = async () => {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkTheme(savedTheme === 'dark');
        }
      };
      loadTheme();
  
  }, [])
  

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);