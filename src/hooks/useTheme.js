import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { THEMES } from '../theme/colors';
import { SettingModel } from '../services/database/models/setting'; 

const ThemeContext = createContext();

/**
 * Fournit l'état du thème et les fonctions de bascule.
 * Charge/Sauvegarde l'état 'mode sombre' via le SettingModel.
 */
export const ThemeProvider = ({ children }) => {
  
	const osScheme = useColorScheme(); 
	const [currentThemeKey, setCurrentThemeKey] = useState(osScheme || 'light');
	const [isThemeLoaded, setIsThemeLoaded] = useState(false);

	const theme = THEMES[currentThemeKey] || THEMES.light;

	const isDarkMode = currentThemeKey === 'dark';


	useEffect(() => {
	const loadTheme = async () => {
		try {
			const persistedTheme = await SettingModel.get('theme');

			if (persistedTheme === 'dark' || persistedTheme === 'light') {
				setCurrentThemeKey(persistedTheme);
			}
		} catch (error) {
			console.warn("Erreur lors du chargement du thème depuis la DB, utilisant l'OS:", error.message);
		} finally {
			setIsThemeLoaded(true);
		}
	};
	loadTheme();
	}, []); 

	const toggleTheme = async () => {
		const newThemeKey = isDarkMode ? 'light' : 'dark';
		setCurrentThemeKey(newThemeKey);

		try {
			await SettingModel.set('theme', newThemeKey);
			console.log(`Thème mis à jour et sauvegardé: ${newThemeKey}`);
		} catch (error) {
			console.error("Erreur lors de la sauvegarde du thème en DB:", error.message);
		}
	};

	const value = { 
		theme, 
		isDarkMode, 
		toggleTheme,
		isThemeLoaded,
	};

	return (
		<ThemeContext.Provider value={value}>
			{isThemeLoaded ? children : null} 
		</ThemeContext.Provider>
	);
};

/**
 * Hook pour accéder facilement au thème (couleurs) et à la fonction toggleTheme.
 * @returns {{ theme: Object, isDarkMode: boolean, toggleTheme: function, isThemeLoaded: boolean }}
 */
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme doit être utilisé dans un ThemeProvider');
	}
	return context;
};