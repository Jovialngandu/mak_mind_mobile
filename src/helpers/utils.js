
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

export const convertToCSV = (clips) => {
	const headers = ['ID', 'Content', 'Source', 'Created At', 'Updated At'];

	let csv = headers.join(',') + '\n';

	clips.forEach(clip => {
		const row = [
			`"${clip.id || ''}"`,
			`"${(clip.content || '').replace(/"/g, '""')}"`,
			`"${clip.source || ''}"`,
			`"${clip.created_at || ''}"`,
			`"${clip.updated_at || ''}"`
		];
		csv += row.join(',') + '\n';
	});

	return csv;
};

// Fonction utilitaire pour convertir en JSON
export const convertToJSON = (clips) => {
	return JSON.stringify(clips, null, 2);
};


// Fonction pour demander les permissions (Android)
export const requestStoragePermission = async () => {
	if (Platform.OS === 'android') {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				{
					title: "Permission de stockage",
					message: "L'application a besoin d'accéder au stockage pour exporter vos données",
					buttonNeutral: "Plus tard",
					buttonNegative: "Annuler",
					buttonPositive: "OK"
				}
			);
			return granted === PermissionsAndroid.RESULTS.GRANTED;
		} catch (err) {
			console.warn('Erreur permission:', err);
			return false;
		}
	}
	return true; // iOS n'a pas besoin de cette permission
};


// Fonction pour sauvegarder le fichier
export const saveFile = async (content, filename) => {
	try {
		const path = `${RNFS.DownloadDirectoryPath}/${filename}`;
		await RNFS.writeFile(path, content, 'utf8');
		return path;
	} catch (error) {
		console.error('Erreur sauvegarde:', error);
		throw error;
	}
};


// Fonction safe pour afficher les alertes
const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
	if (isMounted.current) {
		setTimeout(() => {
			if (isMounted.current) {
				Alert.alert(title, message, buttons);
			}
		}, 100);
	}
};
