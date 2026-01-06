import { useState, useEffect, useRef, useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard'; 
import { SettingModel } from '../services/database/models/setting';

const CHECK_INTERVAL = 500;

/**
 * Hook de gestion du presse-papier (Clipboard Manager).
 * Ce hook fusionne la surveillance en temps réel pour la déduplication
 * et les fonctions utilitaires pour la lecture/écriture.
 *
 * @param {object} props
 * @param {function} props.onNewClipFound Fonction à appeler lorsqu'un nouveau clip est détecté et prêt à être sauvegardé.
 */
export const useClipboard = ({ onNewClipFound }) => {
 
	const [lastCachedClip, setLastCachedClip] = useState(null);
	const onNewClipFoundRef = useRef(onNewClipFound);
	onNewClipFoundRef.current = onNewClipFound;

	const [isCopied, setIsCopied] = useState(false);
	const [hasContent, setHasContent] = useState(false);

	const [clipboardInterval,setClipboardInterval]=useState(CHECK_INTERVAL)


	const readText = useCallback(async () => {
		try {
			const text = await Clipboard.getString();
			setHasContent(!!text); 
			return text;
		} catch (e) {
			console.error("Erreur lors de la lecture du presse-papiers:", e);
			setHasContent(false);
			return '';
		}
	}, []);

	useEffect(() => {
			const loadSettings = async () => {
				try {
					const interval = await SettingModel.get('clipboard_check_interval');
					if (interval) {
						setClipboardInterval(interval);
					}
				} catch (e) {
					console.error("Erreur lors du chargement des paramètres:", e);
				}
			};
			loadSettings();
	}, []);

	useEffect(() => {
		readText();
	}, [readText]);


	const writeText = useCallback((text) => {
		Clipboard.setString(text);    
		setLastCachedClip(text);     
		setIsCopied(true);

		setTimeout(() => setIsCopied(false), 1500);

	setHasContent(!!text); 
	}, []);


	const checkClipboardForNewContent = useCallback(async () => {
		try {
			const currentText = await Clipboard.getString();
			
			setHasContent(!!currentText); 

			if (!currentText || currentText === lastCachedClip) {
				return; 
			}

			setLastCachedClip(currentText);

			const newClip = {
			content: currentText,
			source: 'system',
			};
			
			if (onNewClipFoundRef.current) {
				onNewClipFoundRef.current(newClip);
			}

		} catch (error) {
			console.error("[Clipboard Manager] Erreur lors de la vérification du presse-papier:", error);
			setHasContent(false);
		}
	}, [lastCachedClip]); 

	useEffect(() => {
		const intervalId = setInterval(checkClipboardForNewContent, clipboardInterval);
		return () => clearInterval(intervalId);
	}, [checkClipboardForNewContent]); 

	const setInitialLastClip = useCallback((clipContent) => {
		setLastCachedClip(clipContent);
	}, []);

	return { 
		writeText, 
		readText, 
		setInitialLastClip, 

		isCopied, 
		hasContent,
		lastCachedClip 
	};
};