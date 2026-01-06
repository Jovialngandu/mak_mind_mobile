import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

const logoSource = require('../../assets/logo.png'); 
/**
 * Écran d'accueil de l'application (Bienvenue  MakMind).
 * 
 * @param {Object} props
 * @param {function} props.onStartPress 
 */
const WelcomeScreen = ({ onStartPress, onLoginPress }) => {
	const { theme, toggleTheme, isDarkMode } = useTheme();
	const insets = useSafeAreaInsets();

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.background,
			paddingTop: insets.top,
			paddingHorizontal: 30,
			justifyContent: 'space-between',
		},
		content: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		imageContainer: {
			width: 200,
			height: 200,
			marginBottom: 40,
		},
		illustration: {
			width: '100%',
			height: '100%',
			resizeMode: 'contain',
			borderRadius:100
		},
		title: {
			fontSize: 28,
			fontWeight: 'bold',
			textAlign: 'center',
			color: theme.textPrimary,
			marginBottom: 15,
		},
		subtitle: {
			fontSize: 16,
			textAlign: 'center',
			color: theme.textSecondary,
			lineHeight: 24,
		},
		footer: {
			paddingBottom: insets.bottom + 70,
			alignItems: 'center',
		},
		startButton: {
			width: '100%',
			paddingVertical: 16,
			borderRadius: 12,
			backgroundColor: theme.primary,
			marginBottom: 20,
		},
		startButtonText: {
			fontSize: 18,
			fontWeight: '700',
			color: theme.cardBackground, // Texte blanc ou très clair
			textAlign: 'center',
		},
		toggleText: {
			fontSize: 14,
			color: theme.textSecondary,
			padding: 5,
		},
	});

	return (
		<View style={styles.container}>
			{/* Contenu principal */}
			<View style={styles.content}>
			<View style={styles.imageContainer}>
				<Image 
				source={logoSource} 
				style={styles.illustration} 
				onError={(e) => console.error('Erreur de chargement de l image:', e.nativeEvent.error)} 
				/>
			</View>

			<Text style={styles.title}>
				{/* Bienvenue sur MakMind */}
			</Text>
			<Text style={styles.subtitle}>
				Gérez facilement votre historique de presse-papiers, organisez vos extraits et boostez votre productivité.
			</Text>
			</View>

			{/* Footer (Boutons) */}
			<View style={styles.footer}>
			<TouchableOpacity style={styles.startButton} onPress={onStartPress}>
				<Text style={styles.startButtonText}>
				Commencer
				</Text>
			</TouchableOpacity>

			{/* Bouton pour basculer le thème */}
			{/* <TouchableOpacity onPress={toggleTheme}>
				<Text style={styles.toggleText}>
				Passer en mode {isDarkMode ? 'Clair' : 'Sombre'}
				</Text>
			</TouchableOpacity> */}
			</View>
		</View>
	);
};

export default WelcomeScreen;