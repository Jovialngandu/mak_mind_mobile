import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../theme/colors';

/**
 * Affiche un élément de l'historique du presse-papiers.
 * @param {Object} props
 * @param {Object} props.clip L'objet clip {id, content, source, date, time, isPinned}.
 * @param {function} props.onPress Gère le clic (sélection/navigation).
 * @param {function} props.onLongPress Gère l'appui long.
 * @param {boolean} props.isSelected Indique si l'élément est sélectionné.
 */
const ClipListItem = ({ clip, onPress, onLongPress, isSelected }) => {
	const { theme } = useTheme();

	const displayContent = clip.content.length > 50 
		? clip.content.substring(0, 47) + '...' 
		: clip.content;



	const primaryTextStyle = { color: isSelected ? theme.cardBackground : theme.textPrimary };
	const secondaryTextStyle = { color: isSelected ? theme.cardBackground : theme.textSecondary };

	const styles = StyleSheet.create({
		container: {
			padding: SIZES.margin * 1.5,
			marginBottom: SIZES.margin,
			borderRadius: SIZES.radius,
			borderWidth: 1,
			shadowColor: theme.shadowColor,
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 2,
			elevation: 2,
		},
		content: {
			fontSize: 14,
			fontWeight: '500',
			marginBottom: SIZES.margin / 2,
		},
		metadataRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		dateTime: {
			fontSize: 12,
		},
		source: {
			fontSize: 12,
			fontWeight: 'bold',
		}
	});

	const containerStyle = [
		styles.container,
		{ backgroundColor: theme.cardBackground, borderColor: theme.border },
		isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
	];

	return (
		<TouchableOpacity 
			style={containerStyle} 
			onPress={onPress}
			onLongPress={onLongPress}
		>
			<Text style={[styles.content, primaryTextStyle]} numberOfLines={3}>
				{displayContent}
			</Text>
			<View style={styles.metadataRow}>
				<Text style={[styles.dateTime, secondaryTextStyle]}>
					{clip.created_at}
				</Text>
				{/* <Text style={[styles.source, secondaryTextStyle,{fontWeight:'bold'}]}>
					{clip.source}
				</Text> */}
			</View>
		</TouchableOpacity>
	);
};

export default ClipListItem;