import { useState, useEffect } from 'react';
import { database } from '../services/database/Database';
import { SettingModel } from '../services/database/models/setting';
import { ClipboardModel } from '../services/database/models/clipboard';

export const useInitialization = () => {
	const [isDBReady, setIsDBReady] = useState(false);
	const [isDBError, setIsDBError] = useState(false);

	useEffect(() => {
	const setupDatabase = async () => {
		try {
		console.log("Démarrage de l'initialisation de la DB...");
		
		await database.initialize('app.db');
		await SettingModel.createTable()
		await ClipboardModel.createTable()

		await SettingModel.seedDefaults()
		
		console.log("Initialisation de la DB terminée.");
		setIsDBReady(true);
		
		} catch (error) {
			if (error.message && error.message.includes('already open')) {
				console.log("DB déjà ouverte - initialisation considérée comme réussie");
				setIsDBReady(true);
			} else {
				console.error("Erreur critique lors de l'initialisation de la DB:", error);
				setIsDBError(true);
			}
		}
	};

	setupDatabase();
	}, []);

	return { isDBReady, isDBError };
};