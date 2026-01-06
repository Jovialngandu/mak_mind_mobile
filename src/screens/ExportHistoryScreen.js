import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../theme/colors';
import Header from '../components/common/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import {ClipboardModel} from '../services/database/models/clipboard';
import {convertToCSV,convertToJSON,requestStoragePermission,saveFile} from '../helpers/utils'

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
    const [isExporting, setIsExporting] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollContainer: {
            padding: SIZES.padding,
            paddingBottom: insets.bottom + 80,
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
            opacity: 1,
        },
        exportButtonDisabled: {
            opacity: 0.6,
        },
        exportButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.cardBackground,
            marginLeft: SIZES.margin,
        }
    });


    const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
        if (isMounted.current) {
            setTimeout(() => {
                if (isMounted.current) {
                    Alert.alert(title, message, buttons);
                }
            }, 100);
        }
    };

    const handleExport = async () => {
        if (isExporting) return;
        
        setIsExporting(true);
        
        try {
            if (!isMounted.current) return;

            const clipDatas = await ClipboardModel.findAll();
            
            if (!clipDatas || clipDatas.length === 0) {
                showAlert('Aucune donnée', 'Aucun clip à exporter');
                return;
            }

            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                showAlert('Permission refusée', 'Impossible d\'exporter sans permission de stockage');
                return;
            }

            let content, filename;

            if (exportFormat === 'JSON') {
                content = convertToJSON(clipDatas);
                filename = `clipboard_history_${new Date().toISOString().split('T')[0]}.json`;
            } else {
                content = convertToCSV(clipDatas);
                filename = `clipboard_history_${new Date().toISOString().split('T')[0]}.csv`;
            }

            // Sauvegarder le fichier
            const filePath = await saveFile(content, filename);
            
            console.log(`Fichier sauvegardé: ${filePath}`);
            
            showAlert(
                'Export réussi',
                `Vos ${clipDatas.length} clips ont été exportés en ${exportFormat}.\n\nFichier: ${filename}`
            );

        } catch (error) {
            console.error('Erreur export:', error);
            showAlert(
                'Erreur',
                'Une erreur est survenue lors de l\'exportation: ' + (error.message || 'Erreur inconnue')
            );
        } finally {
            if (isMounted.current) {
                setIsExporting(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Header 
                title="Export" 
                onBack={onBack}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                
                <Text style={styles.sectionTitle}>Autres</Text>
                <View style={[styles.settingRow, styles.switchRow]}>
                    <Text style={styles.label}>Inclure la source et la date</Text>
                    <Switch
                        value={includeMetadata}
                        onValueChange={setIncludeMetadata}
                        trackColor={{ false: theme.border, true: theme.primary }}
                        thumbColor={theme.cardBackground}
                    />
                </View>
            </ScrollView>

            <View style={styles.exportButtonContainer}>
                <TouchableOpacity 
                    style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
                    onPress={handleExport}
                    disabled={isExporting}
                >
                    <Icon 
                        name={isExporting ? "hourglass-outline" : "download-outline"} 
                        size={24} 
                        color={theme.cardBackground} 
                    />
                    <Text style={styles.exportButtonText}>
                        {isExporting ? 'Export en cours...' : `Exporter l'historique complet (${exportFormat})`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ExportHistoryScreen;