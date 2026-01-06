import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../theme/colors';
import Header from '../components/common/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { SettingModel } from '../../src/services/database/models/setting';

/**
 * Écran de gestion des paramètres de l'application.
 * @param {Object} props
 * @param {function} props.onBack Fonction pour revenir à l'écran précédent.
 * @param {function} props.onExportPress Fonction pour naviguer vers l'écran d'export.
 */
const SettingsScreen = ({ onBack, onExportPress }) => {
	const { theme, isDarkMode, toggleTheme } = useTheme();
	const insets = useSafeAreaInsets();

	const [watcherInterval, setWatcherInterval] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState(null);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.background,
		},
		scrollContainer: {
			padding: SIZES.padding,
			paddingBottom: insets.bottom + 80, // Espace pour le bouton de sauvegarde fixe
		},
		sectionTitle: {
			fontSize: 16,
			fontWeight: 'bold',
			color: theme.primary,
			marginTop: SIZES.padding,
			marginBottom: SIZES.margin,
		},
		settingRow: {
			backgroundColor: theme.cardBackground,
			padding: SIZES.padding,
			borderRadius: SIZES.radius,
			marginBottom: SIZES.margin,
		},
		label: {
			fontSize: 16,
			fontWeight: '500',
			color: theme.textPrimary,
			marginBottom: SIZES.margin / 2,
		},
		input: {
			height: 40,
			backgroundColor: theme.background,
			borderRadius: SIZES.radius,
			paddingHorizontal: SIZES.margin,
			color: theme.textPrimary,
			borderWidth: 1,
			borderColor: theme.border,
		},
		hintText: {
			fontSize: 12,
			color: theme.textSecondary,
			marginTop: 4,
		},
		switchRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		switchLabel: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		switchText: {
			fontSize: 16,
			color: theme.textPrimary,
			marginLeft: SIZES.margin,
		},
		saveButtonContainer: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			padding: SIZES.padding,
			backgroundColor: theme.background, // S'assurer que le fond est solide
			paddingBottom: insets.bottom + SIZES.padding,
			borderTopWidth: 1,
			borderTopColor: theme.border,
		},
		saveButton: {
			backgroundColor: theme.primary,
			paddingVertical: 14,
			borderRadius: SIZES.radius,
			alignItems: 'center',
			opacity: isSaving ? 0.6 : 1,
		},
		saveButtonText: {
			fontSize: 16,
			fontWeight: '600',
			color: theme.cardBackground,
		},
		message: {
			textAlign: 'center',
			marginBottom: SIZES.margin,
			fontSize: 14,
			color: theme.success,
		}
	});

	useEffect(() => {
		const loadSettings = async () => {
			try {
				const interval = await SettingModel.get('clipboard_check_interval');
				if (interval) {
					setWatcherInterval(interval.toString());
				}
			} catch (e) {
				console.error("Erreur lors du chargement des paramètres:", e);
			}
		};
		loadSettings();
	}, []);

	// Gère la sauvegarde des paramètres
	const handleSave = async () => {
		setIsSaving(true);
		setSaveMessage(null);
		try {
			const interval = parseInt(watcherInterval, 10);
			if (isNaN(interval) || interval < 100) {
				setSaveMessage('Veuillez entrer une valeur valide (>= 100 ms).');
				return;
			}
			
			await SettingModel.set('clipboard_check_interval', watcherInterval);
			
			setSaveMessage('Modifications sauvegardées avec succès !');

		} catch (e) {
			console.error("Échec de la sauvegarde des paramètres:", e);
			setSaveMessage('Échec de la sauvegarde. Voir la console pour les détails.');
		} finally {
			setIsSaving(false);
			setTimeout(() => setSaveMessage(null), 3000);
		}
	};

	const renderHeaderRight = () => (
		<TouchableOpacity onPress={handleSave}>
			<Icon name="save-outline" size={24} color={theme.iconPrimary} />
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<Header 
				title="Paramètres" 
				onBack={onBack}
				// RightComponent={renderHeaderRight()}
			/>

			<ScrollView contentContainerStyle={styles.scrollContainer}>
				{/* Options de base */}
				<Text style={styles.sectionTitle}>Options de base</Text>
				<View style={styles.settingRow}>
					<Text style={styles.label}>Intervalle du Clipboard Watcher (ms)</Text>
					<TextInput
						style={styles.input}
						value={watcherInterval}
						onChangeText={setWatcherInterval}
						keyboardType="numeric"
						placeholder="1000"
						placeholderTextColor={theme.textSecondary}
					
					/>
					<Text style={styles.hintText}>
						Fréquence de vérification du presse-papier (1000ms = 1 seconde).
					</Text>
				</View>

				{/* Thème de l'application */}
				<Text style={styles.sectionTitle}>Thème de l'application</Text>
				<View style={[styles.settingRow, styles.switchRow]}>
					<View style={styles.switchLabel}>
						<Icon name="settings-outline" size={20} color={theme.textPrimary} />
						<Text style={styles.switchText}>Mode Sombre</Text>
					</View>
					<Switch
						value={isDarkMode}
						onValueChange={toggleTheme}
						trackColor={{ false: theme.border, true: theme.primary }}
						thumbColor={theme.cardBackground}
					/>
				</View>

				{/* Option d'export */}
				<Text style={styles.sectionTitle}>Données et Export</Text>
				<TouchableOpacity 
					style={styles.settingRow}
					onPress={onExportPress}
				>
					<View style={styles.switchLabel}>
						<Icon name="lock-closed-outline" size={20} color={theme.textPrimary} />
						<Text style={styles.switchText}>Sauvegarder les modifications (Export)</Text>
					</View>
				</TouchableOpacity>

			</ScrollView>

			{/* Bouton de sauvegarde fixe (alternative au bouton dans le header) */}
			<View style={styles.saveButtonContainer}>
				{saveMessage && <Text style={styles.message}>{saveMessage}</Text>}
				<TouchableOpacity 
					style={styles.saveButton} 
					onPress={handleSave} 
					disabled={isSaving}
				>
					<Text style={styles.saveButtonText}>
						{isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SettingsScreen;