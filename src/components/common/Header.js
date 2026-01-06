import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * Barre de navigation personnalisée pour les écrans.
 * Supporte le thème clair/sombre.
 * @param {Object} props
 * @param {string} props.title Le titre de l'écran.
 * @param {function} [props.onBack] Fonction appelée au clic sur le bouton Retour.
 * @param {React.ReactNode} [props.RightComponent] Composant affiché à droite (ex: bouton Sauvegarder).
 */
const Header = ({ title, onBack, RightComponent }) => {
	const { theme } = useTheme();

	const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 56, // Hauteur standard
		backgroundColor: theme.background,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: theme.border,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: theme.textPrimary,
		// Centre le titre si aucun bouton Retour n'est présent ou que l'espace est grand
		flex: 1, 
		textAlign: 'center',
	},
	buttonContainer: {
		width: 40, // Taille fixe pour alignement
		alignItems: 'center',
	},
	backButton: {
		padding: 5,
	},
	});

	return (
	<View style={styles.header}>
		{/* Bouton Retour (Gauche) */}
		<View style={styles.buttonContainer}>
		{onBack && (
			<TouchableOpacity onPress={onBack} style={styles.backButton}>
			<Icon name="arrow-back" size={24} color={theme.iconPrimary} />
			</TouchableOpacity>
		)}
		</View>

		{/* Titre central */}
		<Text style={styles.title}>{title}</Text>

		{/* Composant de droite (Ex: Sauvegarder, Loupe) */}
		<View style={styles.buttonContainer}>
		{RightComponent}
		</View>
	</View>
	);
};

export default Header;