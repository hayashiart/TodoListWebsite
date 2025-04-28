// Confirme le chargement de server.js avec la configuration corrigée
console.log('Loading server.js with corrected CSP (no frame-ancestors) - 2025-04-28');
// Importe Express pour créer un serveur web
const express = require('express');

// Importe dotenv pour charger les variables d’environnement
const dotenv = require('dotenv');

// Importe l’objet db pour Sequelize
const db = require('./models');

// Importe cors pour permettre les requêtes cross-origin
const cors = require('cors');

// Importe Helmet pour ajouter des en-têtes de sécurité
const helmet = require('helmet');

// Importe cookie-parser pour gérer les cookies
const cookieParser = require('cookie-parser');

// Importe csurf pour la protection CSRF
const csurf = require('csurf');

// Charge les variables d’environnement depuis .env
// Syntaxe : dotenv.config avec chemin absolu
// Rôle : Définit PORT et autres variables
dotenv.config({ path: '/home/seblin/todo-list/.env' });

// Crée une instance de l’application Express
// Syntaxe : express() initialise l’application
// Rôle : Définit le serveur qui gère les requêtes
const app = express();

// Configure CORS pour autoriser uniquement le frontend
// Syntaxe : cors({ origin, credentials }) restreint les origines
// Arguments : origin (URL autorisée), credentials (permet les cookies)
// Retour : Middleware qui autorise les requêtes
// Rôle : Permet les requêtes depuis http://localhost:3000 avec cookies
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Ajoute le middleware pour parser les corps JSON
// Syntaxe : app.use(express.json()) parse les requêtes JSON
// Rôle : Permet de lire les corps de requêtes JSON
app.use(express.json());

// Ajoute le middleware cookie-parser
// Syntaxe : app.use(cookieParser()) parse les cookies
// Arguments : Aucun
// Retour : Aucun, mais rend les cookies accessibles via req.cookies
// Rôle : Nécessaire pour stocker le token CSRF dans un cookie
app.use(cookieParser());

// Ajoute un middleware pour logger les en-têtes CSP
// Syntaxe : app.use((req, res, next)) ajoute un middleware
// Arguments : req (requête), res (réponse), next (suivant)
// Retour : Passe à next() après avoir loggé
// Rôle : Aide à déboguer les en-têtes envoyés
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('CSP Header:', res.get('Content-Security-Policy'));
  });
  next();
});


// Ajoute Helmet avec configuration personnalisée
// Syntaxe : app.use(helmet({ options })) applique le middleware
// Arguments : options (objet) pour personnaliser les en-têtes
// Retour : Aucun, mais configure les en-têtes
// Rôle : Protège contre XSS, clickjacking, et autorise reCAPTCHA
console.log('Applying Helmet with corrected CSP (no frame-ancestors) - 2025-04-28');
app.use(helmet({
  frameguard: {
    action: 'deny', // Force X-Frame-Options à DENY
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      scriptSrc: ["'self'", 'https://www.google.com', 'https://www.gstatic.com'],
      scriptSrcElem: ["'self'", 'https://www.google.com', 'https://www.gstatic.com', "'unsafe-inline'"], // Autorise scripts inline reCAPTCHA
      frameSrc: ["'self'", 'https://www.google.com', 'https://www.gstatic.com'], // Autorise les iframes reCAPTCHA
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://www.google.com', 'https://www.gstatic.com'], // Autorise les requêtes à l’API reCAPTCHA
      workerSrc: ["'self'", 'blob:'], // Autorise les Web Workers pour reCAPTCHA
    },
  },
}));
// Configure csurf pour générer des tokens CSRF
// Syntaxe : csurf({ cookie }) crée un middleware CSRF
// Arguments : cookie (objet) définit le stockage du token
// Retour : Middleware qui génère/valide les tokens
// Rôle : Prépare la protection CSRF pour les routes spécifiques
const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'strict' } });

// Endpoint pour obtenir un token CSRF
// Syntaxe : app.get(path, middleware, callback) définit une route
// Arguments : path (endpoint), middleware (csurf), callback (réponse)
// Retour : Réponse JSON avec le token
// Rôle : Fournit un token CSRF au frontend sans exiger de token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  // Envoie le token CSRF généré
  // Syntaxe : res.json(data) envoie une réponse JSON
  // Arguments : data (objet) contenant le token
  // Retour : Réponse HTTP
  // Rôle : Permet au frontend d’obtenir un token pour les requêtes POST/PUT/DELETE
  res.json({ csrfToken: req.csrfToken() });
});

// Synchronise la base de données
// Syntaxe : db.sequelize.sync() synchronise les modèles avec PostgreSQL
// Rôle : Crée les tables Users et Tasks si elles n’existent pas
db.sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.error('Database sync failed:', error);
});

// Charge les routes utilisateur et tâche
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Monte les routes sur /api sans CSRF global
// Syntaxe : app.use('/api', routes) associe les routes
// Arguments : path (préfixe), routes (gestionnaire)
// Retour : Aucun, mais lie les routes aux endpoints
// Rôle : Permet d’appliquer CSRF uniquement aux routes spécifiques
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

// Définit le port à partir de .env ou 5000 par défaut
const PORT = process.env.PORT || 5000;

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});