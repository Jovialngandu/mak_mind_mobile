import { open, enableSimpleNullHandling } from 'react-native-nitro-sqlite';

enableSimpleNullHandling(); 

class NitroDB {
	/**
	 * @private
	 * @type {object | null} L'objet de connexion à la DB de nitro-sqlite
	 */
	db = null;

	/**
	 * @private
	 * @type {boolean} Indique si la DB est déjà initialisée
	 */
	isInitialized = false;

	/**
	 * @private
	 * @type {Promise | null} Promesse d'initialisation en cours
	 */
	initializationPromise = null;

	/**
	 * Initialise et ouvre la connexion à la base de données.
	 * Cette méthode doit être appelée avant toute autre opération.
	 * @param {string} dbName Le nom du fichier de base de données (ex: 'app.db').
	 */
	async initialize(dbName = 'app.db') {
		if (this.isInitialized) {
			console.log(`Database ${dbName} already initialized`);
			return;
		}

		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		try {
			// On stocke la promesse pour les appels concurrents
			this.initializationPromise = this._initializeInternal(dbName);
			await this.initializationPromise;
			
		} finally {
			this.initializationPromise = null;
		}
	}

	/**
	 * Méthode interne pour l'initialisation réelle
	 * @private
	 */
	async _initializeInternal(dbName) {
		try {
			console.log(`Connecting to SQLite DB: ${dbName} using react-native-nitro-sqlite`);
			
			this.db = open({ name: dbName });
			this.isInitialized = true;
			
			console.log(`Connected to SQLite DB: ${dbName}`);

		} catch (error) {
			console.error('Failed to initialize database:', error.message);
			this.isInitialized = false;
			this.db = null;
			throw error;
		}
	}

	/**
	 * Vérifie si la base de données est initialisée
	 * @returns {boolean}
	 */
	getIsInitialized() {
		return this.isInitialized;
	}

	/**
	 * Exécute une requête qui modifie la base de données (INSERT, UPDATE, DELETE).
	 * @param {string} query Requête SQL.
	 * @param {Array<any>} params Paramètres de la requête.
	 * @returns {Promise<{id: number, changes: number}>} Retourne l'ID inséré et le nombre de lignes affectées.
	 */
	async run(query, params = []) {
		if (!this.isInitialized || !this.db) {
			throw new Error('Database not initialized. Call initialize() first.');
		}

		const result = await this.db.executeAsync(query, params);

		return { 
			id: result.insertId || 0, 
			changes: result.rowsAffected 
		};
	}

	/**
	 * Récupère une seule ligne de résultat.
	 * @param {string} query Requête SQL (ex: SELECT).
	 * @param {Array<any>} params Paramètres de la requête.
	 * @returns {Promise<object | undefined>} Le premier enregistrement ou undefined.
	 */
	async get(query, params = []) {
		if (!this.isInitialized || !this.db) {
			throw new Error('Database not initialized. Call initialize() first.');
		}

		const { rows } = await this.db.executeAsync(query, params);

		return rows?.length > 0 ? rows.item(0) : undefined;
	}

	/**
	 * Récupère toutes les lignes de résultat.
	 * @param {string} query Requête SQL (ex: SELECT).
	 * @param {Array<any>} params Paramètres de la requête.
	 * @returns {Promise<Array<object>>} Tableau de tous les enregistrements.
	 */
	async all(query, params = []) {
		if (!this.isInitialized || !this.db) {
			throw new Error('Database not initialized. Call initialize() first.');
		}

		const { rows } = await this.db.executeAsync(query, params);

		if (!rows || rows.length === 0) return [];

		const results = [];
		for (let i = 0; i < rows.length; i++) {
			results.push(rows.item(i));
		}
		return results;
	}

	/**
	 * Exécute un ensemble de requêtes dans une seule transaction.
	 * @param {(tx: Transaction) => void | Promise<void>} fn La fonction contenant les requêtes à exécuter.
	 * @returns {Promise<void>}
	 */
	async transaction(fn) {
		if (!this.isInitialized || !this.db) {
			throw new Error('Database not initialized. Call initialize() first.');
		}

		return this.db.transaction(fn);
	}

	/**
	 * Ferme la connexion à la base de données.
	 */
	close() {
		if (this.db) {
			this.db.close();
			this.db = null;
			this.isInitialized = false;
			console.log('🚪 Database connection closed.');
		}
	}
}

// Exporte une instance singleton
export const database = new NitroDB();