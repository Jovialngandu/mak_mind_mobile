import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Text, BackHandler } from 'react-native';
// Import des modèles de base de données
import { SettingModel } from '../services/database/models/setting';
import { ClipboardModel } from '../services/database/models/clipboard';

// Imports des systèmes principaux
import { useClipboard } from '../hooks/useClipboard';
import { useTheme } from '../hooks/useTheme'; 


// Écrans
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ClipDetailScreen from '../screens/ClipDetailScreen';
import ExportHistoryScreen from '../screens/ExportHistoryScreen';


/**
 * Conteneur de navigation et de logique d'affichage.
 * Utilise le thème (couleurs) fourni par le contexte.
 */

export function MainAppContent() {

    const { theme, isDarkMode } = useTheme();
    const [currentScreen, setCurrentScreen] = useState('loading_initial');
    const [clipData, setClipData] = useState(null); 

    const [isFirstLaunch, setIsFirstLaunch] = useState(true); 
    const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);

    const [homeRefreshKey, setHomeRefreshKey] = useState(0); 

    const triggerHomeRefresh = () => {
        setHomeRefreshKey(prevKey => prevKey + 1);
    };


    const saveClipToDB = async (newClip) => {
        try {
            const createdClip = await ClipboardModel.create({
                content: newClip.content,
                source: newClip.source,
            });
            triggerHomeRefresh(); 

            return createdClip;
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du clip:", error);
            return null;
        }
    };

    const { setInitialLastClip, writeText, readText, isCopied, hasContent } = useClipboard({onNewClipFound: saveClipToDB });


    useEffect(() => {
        const checkLaunchStatus = async () => {
        
            const has_launched = await SettingModel.get('has_launched'); 
            setIsFirstLaunch(has_launched != 0); 

            try {
                const latestClip = await ClipboardModel.findLatest(); 
                if (latestClip && latestClip.content) {
                    setInitialLastClip(latestClip.content);
                } else {
                    setInitialLastClip(null);
                }
            } catch (error) {
                console.error("Erreur lors de la synchro du cache du presse-papier:", error);
                setInitialLastClip(null); 
            }

            setIsInitialCheckComplete(true);
        };

        checkLaunchStatus();
    }, [setInitialLastClip]);


    useEffect(() => {
        if (isInitialCheckComplete) {
            if (isFirstLaunch) {
            setCurrentScreen('welcome');
            } else {
            setCurrentScreen('home');
            }
        }
    }, [isInitialCheckComplete, isFirstLaunch]);

    useEffect(() => {
		const handleBackPress = () => {
			if (currentScreen === 'detail' || currentScreen === 'settings' || currentScreen === 'export') {
				goBack();
				return true; 
			}
			
			return false;
		};

		// Utilisation de la méthode moderne qui retourne un objet de souscription
		const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		return () => backHandler.remove();
    }, [currentScreen]);

    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.background,
        },
        loadingText: {
            fontSize: 18,
            color: theme.textPrimary,
            fontWeight: '600',
        },
    });

    // Fonctions de navigation
    const navigateToHome = () => {
        SettingModel.set('has_launched', 0);
        setIsFirstLaunch(false);
        setCurrentScreen('home');
    };

    const navigateToSettings = () => setCurrentScreen('settings');

    const navigateToExport = () => setCurrentScreen('export');

    const navigateToDetail = (clip) => {
        setClipData(clip);
        setCurrentScreen('detail');
    };

    const goBack = () => {
    // Logique de retour:
        if (currentScreen === 'detail' || currentScreen === 'settings' || currentScreen === 'export') {
            setCurrentScreen('home');
            setClipData(null);
        } else {
            // Dans ce cas, l'événement de retour renvoie false et l'application sera fermée
            setCurrentScreen(isFirstLaunch ? 'welcome' : 'home'); 
        }
    };

    let ScreenComponent;
    switch (currentScreen) {
    case 'loading_initial':
        ScreenComponent = (
            <View style={[styles.safeArea, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={styles.loadingText}>Démarrage...</Text>
            </View>
        );
        break;
    case 'welcome':
        ScreenComponent = <WelcomeScreen onStartPress={navigateToHome} />;
        break;
    case 'home':
        ScreenComponent = <HomeScreen 
            onSettingsPress={navigateToSettings} 
            onClipDetail={navigateToDetail}
            refreshKey={homeRefreshKey} 
        />; 
        break;
    case 'settings':
        ScreenComponent = <SettingsScreen 
            onBack={goBack}
            onExportPress={navigateToExport}
        />;
        break;
    case 'detail':
        ScreenComponent = <ClipDetailScreen 
            onBack={goBack} 
            clip={clipData}
            onEdit={() => console.log('Activer le mode édition')} 
        />;
        break;
    case 'export':
        ScreenComponent = <ExportHistoryScreen 
            onBack={goBack} 
        />;
        break;
    default:
        // Fallback à home
        ScreenComponent = <HomeScreen 
            onSettingsPress={navigateToSettings} 
            onClipDetail={navigateToDetail}
            refreshKey={homeRefreshKey} // NOUVEAU: Passer la clé de rafraîchissement
        />;
    }

    return (
    <View style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        {ScreenComponent}
    </View>
    );
}