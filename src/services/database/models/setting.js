import BaseModel from '../BaseModel';
import { database } from '../Database'; 

class Setting extends BaseModel {

	constructor() {
		super("settings", [
			"key TEXT UNIQUE NOT NULL", 
			"value TEXT"
		]);

	}

	/**
	 * Initialise les paramètres par défaut si la clé n'existe pas.
	 * Doit être appelé ASYNCHRONOUSLY après la création de la table.
	 */
	async seedDefaults() {
		const defaults = [
			{ key: "theme", value: "light" },
			{ key: "clipboard_check_interval", value: "1000" },
		];

		console.log("[Settings] Démarrage du seeding des paramètres...");
		for (const setting of defaults) {
			try {
				const exists = await this.findByKey(setting.key);
				if (!exists) {
					await this.create(setting);
					console.log(`[Settings] Clé '${setting.key}' insérée.`);
				}
			} catch (e) {
				console.warn(`[Settings] Échec du seeding de la clé ${setting.key}:`, e.message);
			}
		}
		console.log("[Settings] Seeding des paramètres terminé.");
	}

	/**
	 * Trouve un enregistrement de paramètre par sa clé.
	 * @param {string} key La clé du paramètre.
	 * @returns {Promise<Object | undefined>} La ligne complète (key, value, timestamps).
	 */
	async findByKey(key) {
		return database.get(
			`SELECT * FROM ${this.tableName} WHERE key = ? AND deleted_at IS NULL`,
			[key]
		);
	}

	/**
	 * Récupère la valeur d'un paramètre.
	 * @param {string} key La clé du paramètre.
	 * @returns {Promise<string | null>} La valeur du paramètre ou null.
	 */
	async get(key) {
		const row = await this.findByKey(key);
		return row ? row.value : null;
	}

	/**
	 * Définit (crée ou met à jour) un paramètre.
	 * @param {string} key La clé du paramètre.
	 * @param {string} value La nouvelle valeur.
	 * @returns {Promise<Object>} Le résultat de l'opération (run result ou record créé).
	 */
	async set(key, value) {
		const existing = await this.findByKey(key);

		if (existing) {
			return database.run(
			`UPDATE ${this.tableName} SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?`,
			[value, key]
			);
		} else {
			return this.create({ key, value });
		}
	}

	/**
	 * Récupère toutes les clés et valeurs des paramètres.
	 * @returns {Promise<Object[]>} Tableau de tous les paramètres actifs ({key, value}).
	 */
	async getAll() {
		return database.all(
			`SELECT key, value FROM ${this.tableName} WHERE deleted_at IS NULL`
		);
	}
}

export const SettingModel = new Setting();