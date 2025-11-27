import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../theme/colors';
import Header from '../components/common/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import ClipListItem from '../components/ClipListItem';
import { SettingModel } from '../services/database/models/setting';
import { ClipboardModel } from '../services/database/models/clipboard';


/**
 * Écran principal affichant l'historique des clips.
 * @param {Object} props
 * @param {function} props.onSettingsPress Navigue vers les paramètres.
 * @param {function} props.onClipDetail Navigue vers l'écran de détail.
 * @param {number} props.refreshKey Clé de rafraîchissement forcée par le parent (App.js) lors d'un nouvel enregistrement.
 */
const HomeScreen = ({ onSettingsPress, onClipDetail, refreshKey }) => { 
	// --- Hooks d'environnement et de Contexte ---
	const { theme, isDarkMode } = useTheme(); 
	const insets = useSafeAreaInsets(); 

	// Hooks d'état
	const [allClips, setAllClips] = useState([]);
	const [filteredClips, setFilteredClips] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [selectedClip, setSelectedClip] = useState(null); // Pour la sélection visuelle

	const [internalRefreshKey, setInternalRefreshKey] = useState(0); 


	// Fonction pour charger et mettre à jour les clips (MÉMOISÉE)
	const loadClips = useCallback(async () => {
		console.log("Rechargement des clips...");
		try {
			const clipDatas = await ClipboardModel.findAll();
			setAllClips(clipDatas);
		} catch (error) {
			console.error("Erreur lors du chargement des clips:", error);
		}
	}, []); 

	const onRefreshClips = useCallback(() => {
		setInternalRefreshKey(prevKey => prevKey + 1);
		setSelectedClip(null); 
	}, []);


	useEffect(()=>{
		loadClips();

	},[loadClips, internalRefreshKey, refreshKey])

	useEffect(() => {
		if (searchText.length > 0) {
			const lowercasedSearchText = searchText.toLowerCase();
			const results = allClips.filter(clip => 
				clip.content.toLowerCase().includes(lowercasedSearchText)
			);
			setFilteredClips(results);
		} else {
			setFilteredClips(allClips);
		}
	}, [searchText, allClips]);


	useEffect(() => {
		const handleBackPress = () => {
			if (selectedClip) {
				setSelectedClip(null);
				return true; // Événement géré localement
			}

			return false;
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
		return () => backHandler.remove();
	}, [selectedClip]); 

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.background,
		},
		searchContainer: {
			padding: SIZES.padding,
			paddingBottom: SIZES.margin,
			borderBottomWidth: 1,
			borderBottomColor: theme.border,
		},
		searchInput: {
			height: 40,
			backgroundColor: theme.cardBackground,
			borderRadius: SIZES.radius,
			paddingHorizontal: SIZES.margin,
			color: theme.textPrimary,
			borderWidth: 1,
			borderColor: theme.border,
		},
		filterRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: SIZES.margin,
		},
		filterButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: 5,
			paddingHorizontal: SIZES.margin,
			borderRadius: SIZES.radius,
			borderWidth: 1,
			borderColor: theme.border,
		},
		filterText: {
			color: theme.textSecondary,
			marginLeft: 5,
		},
		listHeader: {
			padding: SIZES.padding,
			paddingBottom: 0,
			fontSize: 16,
			fontWeight: '600',
			color: theme.textPrimary,
		},
		listContainer: {
			// flex: 1,
			paddingTop:10,
			paddingHorizontal: SIZES.padding,
		},
		bottomActions: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			padding: SIZES.padding,
			backgroundColor: theme.cardBackground,
			borderTopWidth: 1,
			borderTopColor: theme.border,
			paddingBottom: insets.bottom + SIZES.padding,
		},
		actionButton: {
			flex: 1,
			paddingVertical: 12,
			borderRadius: SIZES.radius,
			alignItems: 'center',
			marginHorizontal: 5,
		},
		copyButton: {
			backgroundColor: theme.primary,
		},
		modifyButton: {
			backgroundColor: theme.cardBackground,
			borderWidth: 1,
			borderColor: theme.border,
		},
		deleteButton: {
			backgroundColor: theme.danger,
		},
		buttonText: {
			fontSize: 16,
			fontWeight: '600',
		},
		copyButtonText: {
			color: theme.cardBackground,
		},
		modifyButtonText: {
			color: theme.textPrimary,
		},
		deleteButtonText: {
			color: theme.cardBackground,
		},
		actionButtonSmall: {
			width: 50,
		}
	});


	const renderHeaderRight = () => (
		<TouchableOpacity onPress={onSettingsPress}>
			<Icon name="cog-outline" size={24} color={theme.iconPrimary} />
		</TouchableOpacity>
	);

	// FIX: Utilisation de useCallback pour handleClipSelect pour une meilleure performance
	const handleClipSelect = useCallback((clip) => {
		setSelectedClip(prevSelectedClip => 
			clip.id === prevSelectedClip?.id ? null : clip
		);
	}, []);

	const handleDelete = async () => {
		if (selectedClip) {
			try {
				await ClipboardModel.delete(selectedClip.id); 
				
				onRefreshClips();
				
				console.log(`Suppression du clip ${selectedClip.id} effectuée.`);
			} catch (error) {
				console.error("Erreur lors de la suppression:", error);
			}
		}
	};

	const handleCopy = () => {
		if (selectedClip) {
			// Logique de copie réelle ici
			console.log(`Copie du clip ${selectedClip.id}: ${selectedClip.content}`);
		}
	};

	const handleModify = () => {
		if (selectedClip) {
				// Naviguer vers l'écran de modification avec le clip
			onClipDetail(selectedClip);
		}
	};

	const renderClipItem = useCallback(({ item }) => (
		<ClipListItem 
			clip={item}
			onPress={() => onClipDetail ? onClipDetail(item) : handleClipSelect(item)}
			isSelected={selectedClip?.id === item.id}
			onLongPress={() => handleClipSelect(item)}
		/>
	), [onClipDetail, handleClipSelect, selectedClip?.id]); 

	return (
		<View style={styles.container}>
			{/* Header MakMind */}
			<Header 
				title="Home" 
				RightComponent={renderHeaderRight()}
			/>

			{/* Barre de recherche et filtres */}
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Rechercher..."
					placeholderTextColor={theme.textSecondary}
					value={searchText}
					onChangeText={setSearchText}
				/>
			</View>

			{/* Liste des clips */}
			<FlatList
				data={filteredClips}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderClipItem} // Utilisation du renderItem mémoïsé
				contentContainerStyle={styles.listContainer}
				ListEmptyComponent={() => (
					<View style={{padding: SIZES.padding, alignItems: 'center'}}>
						<Text style={{color: theme.textSecondary, fontStyle: 'italic'}}>
							{searchText ? "Aucun clip ne correspond à votre recherche." : "Votre historique de presse-papiers est vide."}
						</Text>
					</View>
				)}
			/>

			{/* Actions du bas */}
			{/* <View style={styles.bottomActions}>
				{selectedClip ? (
					<>
						<TouchableOpacity style={[styles.actionButton, styles.copyButton]} onPress={handleCopy}>
							<Text style={[styles.buttonText, styles.copyButtonText]}>Copier</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.actionButton, styles.modifyButton]} onPress={handleModify}>
							<Text style={[styles.buttonText, styles.modifyButtonText]}>Modifier</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.actionButtonSmall, styles.deleteButton]} onPress={handleDelete}>
								<Icon name="trash-outline" size={20} color={theme.cardBackground} />
						</TouchableOpacity>
					</>
				) : (
					// Afficher un état par défaut si aucun clip n'est sélectionné (ex: bouton Ajouter)
					<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						<Text style={{textAlign: 'center', color: theme.textSecondary, opacity: 0.6}}>Sélectionnez un clip pour agir</Text>
					</View>
				)}
			</View> */}
		</View>
	);
};

export default HomeScreen;