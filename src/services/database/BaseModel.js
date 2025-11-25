import { database } from './Database'; // Ajustez ce chemin si nécessaire

class BaseModel {
	/**
	 * @param {string} tableName 
	 * @param {string[]} fields 
	 */
	constructor(tableName, fields) {
		this.tableName = tableName;
		this.fields = fields;

	}

	/**
	 * Crée la table dans la base de données de manière asynchrone.
	 */
	async createTable() {
		const columns = this.fields.map(f => `${f}`).join(", "); // Utilisation de TEXT par défaut
		try {
			await database.run(
			`CREATE TABLE IF NOT EXISTS ${this.tableName} (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				${columns},
				deleted_at DATETIME DEFAULT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)`
			);
			console.log(`Table '${this.tableName}' créée ou vérifiée.`);
		} catch (error) {
			console.error(`Erreur lors de la création de la table ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Insère un nouvel enregistrement.
	 * @param {Object} data Les données à insérer (clé/valeur).
	 * @returns {Promise<Object>} L'objet enregistré avec son nouvel ID.
	 */
	async create(data) {
		const keys = Object.keys(data);
		const values = Object.values(data);
		const placeholders = keys.map(() => "?").join(", ");

		const query = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders})`;

		const result = await database.run(query, values); 

		const record = {
			...data,
			id: result.id, 
			created_at: new Date().toISOString()
		};

		return record; 
	}

	/**
	 * Trouve un enregistrement par son ID.
	 * @param {number} id L'ID de l'enregistrement.
	 * @returns {Promise<Object | undefined>} L'enregistrement ou undefined.
	 */
	async findById(id) {

		return database.get(
			`SELECT * FROM ${this.tableName} WHERE id = ? AND deleted_at IS NULL`,
			[id]
		);
	}

	/**
	 * Récupère tous les enregistrements actifs.
	 * @returns {Promise<Object[]>} Le tableau des enregistrements.
	 */
	async findAll() {

		return database.all(
			`SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL ORDER BY created_at DESC`
		);
	}

	/**
	 * Trouve l'enregistrement le plus récent (basé sur l'ID décroissant).
	 * @returns {Promise<Object | undefined>} L'enregistrement le plus récent ou undefined.
	 */
	async findLatest() {

		const query = `SELECT * FROM ${this.tableName} 
						WHERE deleted_at IS NULL 
						ORDER BY id DESC 
						LIMIT 1`;
			return database.get(query); 
	}

	/**
	 * Met à jour un enregistrement existant.
	 * @param {number} id L'ID de l'enregistrement à mettre à jour.
	 * @param {Object} data Les champs à modifier.
	 * @returns {Promise<{id: number, changes: number}>} Le résultat de la requête.
	 */
	async update(id, data) {
		const keys = Object.keys(data);
		const values = Object.values(data);
		const setClause = keys.map((k) => `${k} = ?`).join(", ");

		const query = `UPDATE ${this.tableName} 
						SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
						WHERE id = ? AND deleted_at IS NULL`;
						
		return database.run(query, [...values, id]);
	}

	/**
	 * Effectue une suppression logique (softDelete).
	 * @param {number} id L'ID de l'enregistrement à supprimer.
	 * @returns {Promise<{id: number, changes: number}>} Le résultat de la requête.
	 */
	async softDelete(id) {
		const query = `UPDATE ${this.tableName} 
						SET deleted_at = CURRENT_TIMESTAMP 
						WHERE id = ?`;
						
		return database.run(query, [id]);
	}
}

export default BaseModel;