import React from 'react';
import {StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Imports des systèmes principaux
import { useInitialization } from './src/hooks/useDatabase';

import { ThemeProvider } from './src/hooks/useTheme'; 
import {MainAppContent} from './src/partials/main'

function App() {
    const { isDBReady, isDBError } = useInitialization();

    if (isDBError) {
        return (
            <View style={baseStyles.loadingContainer}>
                <Text style={baseStyles.errorText}>Erreur fatale de la base de données. Impossible de continuer.</Text>
            </View>
        );
    }

    if (!isDBReady) {
        return (
            <View style={baseStyles.loadingContainer}>
            <Text style={baseStyles.loadingText}>Chargement des données...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider>
            <MainAppContent />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

const baseStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
    },
});

export default App;