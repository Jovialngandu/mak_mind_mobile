// --- COULEURS ET THÈMES ---

// Couleurs neutres communes (Backgrounds, Textes, Borders)
const COMMON_COLORS = {
  // Base
  primary: '#1E90FF', // Un bleu vif pour l'action (Boutons, Switches)
  danger: '#DC3545', // Rouge pour les actions dangereuses (Supprimer)
  success: '#28A745', // Vert pour le succès
  
  // Icônes
  iconPrimary: '#1E90FF',
  iconSecondary: '#6C757D',
};

// THÈME CLAIR
const LIGHT_THEME = {
  ...COMMON_COLORS,
  background: '#F8F9FA', // Fond très clair
  cardBackground: '#FFFFFF', // Fond blanc pour les cartes/conteneurs
  textPrimary: '#212529', // Texte foncé
  textSecondary: '#6C757D', // Texte secondaire/gris
  border: '#DEE2E6', // Bordures claires
  shadowColor: '#000000', // Ombre noire pour le relief
};

// THÈME SOMBRE
const DARK_THEME = {
  ...COMMON_COLORS,
  background: '#1A1A1A', // Fond noir profond (utilisé sur la capture d'écran)
  cardBackground: '#2C2C2C', // Fond légèrement plus clair pour les cartes
  textPrimary: '#F8F9FA', // Texte très clair/blanc
  textSecondary: '#ADB5BD', // Texte secondaire clair
  border: '#495057', // Bordures foncées
  shadowColor: '#FFFFFF', // Ombre blanche pour le relief
};

export const THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};

// --- TAILLES ET STYLES COMMUNS (Pour le BaseModel) ---

export const SIZES = {
  padding: 20,
  margin: 10,
  radius: 8,
  headerHeight: 56,
};