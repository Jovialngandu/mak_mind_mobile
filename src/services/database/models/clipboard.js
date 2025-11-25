import BaseModel from '../BaseModel';
import { database } from '../Database'; 

/**
 * Modèle pour gérer le presse-papiers (clipboard) de l'application.
 * Hérite de BaseModel pour les opérations CRUD et les timestamps.
 */
class Clipboard extends BaseModel {
	constructor() {

	super("clipboard", [
		"content TEXT NOT NULL",
		"source TEXT" 
	]);
	}

	/**
	 * Récupère tous les enregistrements de presse-papiers actifs pour une source donnée.
	 * * @param {string} source La source du contenu (ex: 'web', 'app').
	 * @returns {Promise<Object[]>} Tableau des enregistrements trouvés.
	 */
	async findBySource(source) {
	return database.all(
		`SELECT * FROM ${this.tableName} WHERE source = ? AND deleted_at IS NULL ORDER BY created_at DESC`,
		[source]
	);
	}
}

export const ClipboardModel = new Clipboard();