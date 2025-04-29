// Importe Axios pour les requêtes HTTP
import axios from 'axios';

// Crée une instance Axios avec configuration de base
// Syntaxe : axios.create({ ... }) crée une instance personnalisée
// Arguments : baseURL (URL de base pour les requêtes)
// Retour : Instance Axios
// Rôle : Simplifie les requêtes vers le backend
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true, // Envoie les cookies (nécessaire pour CSRF)
});

// Ajoute un intercepteur pour inclure le token CSRF
// Syntaxe : instance.interceptors.request.use(callback) modifie les requêtes
// Arguments : callback (fonction qui modifie la config de la requête)
// Retour : Aucun, mais modifie les requêtes sortantes
// Rôle : Ajoute le token CSRF dans l’en-tête X-CSRF-Token
instance.interceptors.request.use(async (config) => {
  // Vérifie si la méthode nécessite un token CSRF
  // Syntaxe : condition vérifie la méthode HTTP
  // Rôle : Applique le token uniquement pour POST, PUT, DELETE
  if (['post', 'put', 'delete'].includes(config.method)) {
    // Récupère le token CSRF depuis le serveur
    // Syntaxe : instance.get(url) envoie une requête GET
    // Arguments : url (endpoint)
    // Retour : Promesse avec la réponse
    // Rôle : Obtient le token CSRF
    const response = await instance.get('/api/csrf-token');
    
    // Ajoute le token dans l’en-tête
    // Syntaxe : config.headers[key] = value définit un en-tête
    // Arguments : key (nom de l’en-tête), value (valeur)
    // Retour : Config modifiée
    // Rôle : Inclut le token CSRF dans la requête
    config.headers['X-CSRF-Token'] = response.data.csrfToken;
  }
  return config;
});

export default instance;