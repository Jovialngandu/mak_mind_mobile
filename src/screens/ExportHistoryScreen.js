import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../theme/colors';
import Header from '../components/common/Header';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * Écran pour gérer l'exportation de l'historique des clips.
 * @param {Object} props
 * @param {function} props.onBack Fonction pour revenir à l'écran précédent.
 */
const ExportHistoryScreen = ({ onBack }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [exportFormat, setExportFormat] = useState('JSON'); // 'JSON' ou 'CSV'
    const [includeMetadata, setIncludeMetadata] = useState(true);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollContainer: {
            padding: SIZES.padding,
            paddingBottom: insets.bottom + 80, // Espace pour le bouton d'export fixe
        },
        searchRow: {
            flexDirection: 'row',
            marginBottom: SIZES.padding,
        },
        searchInput: {
            flex: 1,
            height: 40,
            backgroundColor: theme.cardBackground,
            borderRadius: SIZES.radius,
            paddingHorizontal: SIZES.margin,
            color: theme.textPrimary,
            borderWidth: 1,
            borderColor: theme.border,
            marginRight: SIZES.margin,
        },
        filterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: SIZES.margin,
            borderRadius: SIZES.radius,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.cardBackground,
            marginRight: SIZES.margin / 2,
        },
        filterText: {
            color: theme.textSecondary,
            marginLeft: 5,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.primary,
            marginTop: SIZES.padding,
            marginBottom: SIZES.margin,
        },
        formatSelector: {
            flexDirection: 'row',
            marginBottom: SIZES.padding,
        },
        formatOption: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: SIZES.radius,
            borderWidth: 1,
            borderColor: theme.border,
            marginRight: SIZES.margin,
        },
        formatSelected: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        formatText: {
            fontWeight: '600',
            color: theme.textPrimary,
        },
        formatTextSelected: {
            color: theme.cardBackground,
        },
        settingRow: {
            backgroundColor: theme.cardBackground,
            padding: SIZES.padding,
            borderRadius: SIZES.radius,
            marginBottom: SIZES.margin,
        },
        switchRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        label: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.textPrimary,
        },
        exportButtonContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: SIZES.padding,
            backgroundColor: theme.background,
            paddingBottom: insets.bottom + SIZES.padding,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        exportButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.primary,
            paddingVertical: 14,
            borderRadius: SIZES.radius,
        },
        exportButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.cardBackground,
            marginLeft: SIZES.margin,
        }
    });

    const handleExport = () => {
        // Logique d'exportation avec les options sélectionnées
        console.log(`Démarrage de l'export en ${exportFormat}. Inclure métadonnées: ${includeMetadata}`);
    };

    return (
        <View style={styles.container}>
            <Header 
                title="Export de l'Historique" 
                onBack={onBack}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Recherche et Filtres */}
                {/* <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher..."
                        placeholderTextColor={theme.textSecondary}
                    />
                    <TouchableOpacity style={styles.filterButton}>
                        <Icon name="server-outline" size={16} color={theme.iconSecondary} />
                        <Text style={styles.filterText}>Source: system system</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton}>
                        <Icon name="calendar-outline" size={16} color={theme.iconSecondary} />
                        <Text style={styles.filterText}>24/11/2025</Text>
                    </TouchableOpacity>
                </View> */}

                {/* Format et Contenu */}
                <Text style={styles.sectionTitle}>Format et Contenu</Text>
                <View style={styles.formatSelector}>
                    <TouchableOpacity 
                        style={[styles.formatOption, exportFormat === 'JSON' && styles.formatSelected]}
                        onPress={() => setExportFormat('JSON')}
                    >
                        <Text style={[styles.formatText, exportFormat === 'JSON' && styles.formatTextSelected]}>JSON</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.formatOption, exportFormat === 'CSV' && styles.formatSelected]}
                        onPress={() => setExportFormat('CSV')}
                    >
                        <Text style={[styles.formatText, exportFormat === 'CSV' && styles.formatTextSelected]}>CSV</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Format de Filler (Non implémenté) */}
                <Text style={styles.sectionTitle}>Autres</Text>
                {/* Basculer les métadonnées */}
                <View style={[styles.settingRow, styles.switchRow]}>
                    <Text style={styles.label}>Inclure la source et la  date </Text>
                    <Switch
                        value={includeMetadata}
                        onValueChange={setIncludeMetadata}
                        trackColor={{ false: theme.border, true: theme.primary }}
                        thumbColor={theme.cardBackground}
                    />
                </View>

            </ScrollView>

            {/* Bouton d'export fixe */}
            <View style={styles.exportButtonContainer}>
                <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
                    <Icon name="download-outline" size={24} color={theme.cardBackground} />
                    <Text style={styles.exportButtonText}>Exporter l'historique complet ({exportFormat})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ExportHistoryScreen;