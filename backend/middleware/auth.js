// Importe jsonwebtoken pour vérifier les tokens JWT
// Rôle : Permet de valider les tokens envoyés par le client
// Syntaxe : require('jsonwebtoken') importe le module jsonwebtoken
// Retour : L’objet jsonwebtoken avec des méthodes comme verify()
const jwt = require('jsonwebtoken');

// Définit le middleware d’authentification JWT
// Arguments :
// - req : Objet représentant la requête HTTP (contient les en-têtes, ex. : Authorization)
// - res : Objet représentant la réponse HTTP (utilisé pour envoyer des erreurs)
// - next : Fonction pour passer au prochain middleware ou à la route
// Retour : Aucun (appelle next() si le token est valide, ou envoie une erreur)
// Syntaxe : module.exports rend le middleware accessible à d’autres fichiers
module.exports = (req, res, next) => {
  // Utilise un bloc try/catch pour gérer les erreurs (ex. : token invalide)
  try {
    // Récupère le token depuis l’en-tête Authorization
    // Exemple d’en-tête : Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    // Syntaxe : req.header('Authorization') accède à l’en-tête Authorization
    // Rôle : Extrait la partie "Bearer <token>" envoyée par le client
    const authHeader = req.header('Authorization');

    // Vérifie si l’en-tête Authorization existe et commence par "Bearer "
    // Syntaxe : !authHeader vérifie si l’en-tête est absent
    // Rôle : Si aucun token n’est fourni, renvoie une erreur
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Envoie une réponse d’erreur avec le code 401 (Unauthorized)
      // Arguments :
      // - 401 : Code HTTP pour "Unauthorized" (pas de token)
      // - Objet JSON : Message d’erreur
      // Syntaxe : res.status(401).json() envoie la réponse
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extrait le token en supprimant "Bearer " de l’en-tête
    // Syntaxe : replace('Bearer ', '') supprime la sous-chaîne "Bearer "
    // Rôle : Isole le token JWT (ex. : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    const token = authHeader.replace('Bearer ', '');

    // Vérifie et décode le token JWT
    // Arguments :
    // - token : La chaîne du token à vérifier
    // - process.env.JWT_SECRET : La clé secrète utilisée pour signer le token
    // Retour : Une promesse qui résout en l’objet payload du token (ex. : { id: 1 })
    // Syntaxe : jwt.verify valide la signature et décode le token
    // Rôle : S’assure que le token est valide et non expiré
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Ajoute les données décodées à l’objet req
    // Syntaxe : req.user = decoded assigne l’objet décodé à req.user
    // Rôle : Rend l’ID de l’utilisateur (decoded.id) disponible pour les routes suivantes
    req.user = decoded;

    // Appelle le prochain middleware ou la route
    // Syntaxe : next() passe le contrôle au prochain gestionnaire
    // Rôle : Permet à la requête de continuer si le token est valide
    next();
  } catch (error) {
    // Gère les erreurs (ex. : token invalide ou expiré)
    // Arguments :
    // - 401 : Code HTTP pour "Unauthorized"
    // - Objet JSON : Message d’erreur
    // Syntaxe : res.status(401).json() envoie la réponse
    // Rôle : Informe le client que le token est invalide
    console.error('Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};