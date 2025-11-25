import React,{useEffect} from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewAppScreen } from '@react-native/new-app-screen';
import { useInitialization } from "./src/hooks/useDatabase";
import { SettingModel } from './src/services/database/models/setting';


function App() {
  const { isDBReady, isDBError } = useInitialization();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const testSettings = async () => {
      if (isDBReady) {
        try {
          console.log("🔄 Test de récupération des settings...");
          
          // Récupérer tous les settings
          const allSettings = await SettingModel.getAll();
          console.log("📋 Tous les settings:", allSettings);
          
          // Récupérer un setting spécifique
          const theme = await SettingModel.get("theme");
          console.log("🎨 Thème:", theme);
          
          // Tester la création d'un nouveau setting
          await SettingModel.set("test_key", "test_value");
          console.log("✅ Setting test créé");
          
          // Re-récupérer pour vérifier
          const testValue = await SettingModel.get("test_key");
          console.log("🧪 Valeur test récupérée:", testValue);
          
        } catch (error) {
          console.error("❌ Erreur lors du test des settings:", error);
        }
      }
    };

    testSettings();
  }, [isDBReady]);
  if (!isDBReady && !isDBError) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
          <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>
            Initialisation...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (isDBError) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.container, styles.centered]}>
          <Text style={[styles.errorText, { color: isDarkMode ? '#fff' : '#000' }]}>
            Erreur lors du chargement de l'application
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default App;