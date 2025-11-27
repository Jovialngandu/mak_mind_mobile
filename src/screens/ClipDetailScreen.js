import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../theme/colors';
import Header from '../components/common/Header';
import Icon from 'react-native-vector-icons/Ionicons';

import { useClipboard } from '../hooks/useClipboard';
import { ClipboardModel } from '../services/database/models/clipboard';

/**
 * Écran pour afficher le contenu complet d'un clip.
 * @param {Object} props
 * @param {function} props.onBack Fonction pour revenir à l'écran précédent.
 * @param {Object} props.clip Le clip à afficher.
 * @param {function} props.onEdit Fonction pour passer en mode édition.
 */
const ClipDetailScreen = ({ onBack, clip, onEdit }) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.background,
		},
		scrollContainer: {
			padding: SIZES.padding,
			paddingBottom: insets.bottom + 80, // Espace pour la barre d'actions
		},
		metadata: {
			fontSize: 14,
			color: theme.textSecondary,
			marginBottom: SIZES.padding,
		},
		contentBox: {
			backgroundColor: theme.cardBackground,
			padding: SIZES.padding,
			borderRadius: SIZES.radius,
			borderWidth: 1,
			borderColor: theme.border,
			shadowColor: theme.shadowColor,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
			minHeight: 200,
		},
		content: {
			fontSize: 16,
			lineHeight: 24,
			color: theme.textPrimary,
		},
		bottomActions: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			flexDirection: 'row',
			justifyContent: 'space-around',
			alignItems: 'center',
			backgroundColor: theme.cardBackground,
			paddingTop: SIZES.margin,
			paddingBottom: insets.bottom + SIZES.margin,
			borderTopWidth: 1,
			borderTopColor: theme.border,
		},
		actionItem: {
			alignItems: 'center',
			padding: SIZES.margin,
		},
		actionText: {
			fontSize: 12,
			color: theme.textSecondary,
			marginTop: 4,
		}
	});

	const { writeText } = useClipboard({onNewClipFound: ()=>{} });
	
	const handleCopy = () => {
		writeText(clip.content)
	};

	const handleShare = () => {
		// Logique de partage
		console.log(`Partage du contenu du clip ${clip.id}`);
	};

	const handlePin = () => {
		// Logique d'épinglage
		console.log(`Épinglage/Désépinglage du clip ${clip.id}`);
	};

	const handleDelete = () => {
		ClipboardModel.softDelete(clip.id)
		console.log(`Suppression du clip ${clip.id}`);
		onBack(); // Retourner après suppression
	};

	const renderHeaderRight = () => (
		<TouchableOpacity onPress={onEdit}>
			<Icon name="pencil-outline" size={24} color={theme.iconPrimary} />
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<Header 
				title="Clip" 
				onBack={onBack}
				// RightComponent={renderHeaderRight()}
			/>

			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Text style={styles.metadata}>
				{clip.created_at}
				</Text>
				
				<View style={styles.contentBox}>
					<Text style={styles.content}>
						{clip.content}
					</Text>
				</View>
				
				
			</ScrollView>

			{/* Barre d'actions du bas */}
			<View style={styles.bottomActions}>
				<TouchableOpacity style={styles.actionItem} onPress={handleCopy}>
					<Icon name="copy-outline" size={24} color={theme.textPrimary} />
					<Text style={styles.actionText}>Copier</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity style={styles.actionItem} onPress={handleShare}>
					<Icon name="share-outline" size={24} color={theme.textPrimary} />
					<Text style={styles.actionText}>Partager</Text>
				</TouchableOpacity> */}
				{/* <TouchableOpacity style={styles.actionItem} onPress={handlePin}>
					<Icon name={clip.isPinned ? "bookmark" : "bookmark-outline"} size={24} color={theme.textPrimary} />
					<Text style={styles.actionText}>{clip.isPinned ? 'Désépingler' : 'Épingler'}</Text>
				</TouchableOpacity> */}
					<TouchableOpacity style={styles.actionItem} onPress={handleDelete}>
					<Icon name="trash-outline" size={24} color={theme.danger} />
					<Text style={styles.actionText}>Supprimer</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ClipDetailScreen;