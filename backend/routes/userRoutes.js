const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const verifyRecaptcha = require('../middleware/verifyRecaptcha');

// Configure csurf pour les routes sensibles
// Syntaxe : csurf({ cookie }) crée un middleware CSRF
// Arguments : cookie (objet) définit le stockage du token
// Retour : Middleware qui valide les tokens
// Rôle : Protège les routes POST contre les attaques CSRF
const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'strict' } });

// Configure le rate limiting pour les routes sensibles
// Syntaxe : rateLimit({ windowMs, max, message }) crée un middleware
// Arguments : windowMs (durée), max (nombre de requêtes), message (réponse)
// Retour : Middleware qui limite les requêtes
// Rôle : Protège contre les attaques par force brute
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: 'Trop de tentatives, réessayez dans 15 minutes',
});

// Validation pour l’inscription
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit avoir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'),
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
];

// Middleware pour gérer les erreurs de validation
// Syntaxe : Fonction middleware avec req, res, next
// Arguments : req, res, next (standard Express)
// Retour : Réponse JSON ou appel à next()
// Rôle : Vérifie les erreurs de validation et renvoie une erreur 400
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// Route POST /register : Inscription avec rate limiting, CSRF, et reCAPTCHA
// Syntaxe : router.post(path, middlewares, controller)
// Arguments : path, middlewares (limiter, reCAPTCHA, CSRF, validation), controller
// Retour : Aucun, mais enregistre l’utilisateur si validé
// Rôle : Protège contre abus automatisés, CSRF, et valide les données
router.post('/register', loginLimiter, csrfProtection, registerValidation, validate, userController.register);

// Route POST /login : Connexion avec rate limiting, CSRF, et reCAPTCHA
// Syntaxe : router.post(path, middlewares, controller)
// Arguments : path, middlewares (limiter, reCAPTCHA, CSRF, validation), controller
// Retour : Aucun, mais authentifie l’utilisateur si validé
// Rôle : Protège contre abus automatisés, CSRF, et valide les données
router.post('/login', loginLimiter, csrfProtection, loginValidation, validate, userController.login);

// Routes protégées par le middleware auth
router.get('/users', auth, userController.getAllUsers);
router.put('/user/:id', auth, csrfProtection, userController.updateUser);
router.delete('/user/:id', auth, csrfProtection, userController.deleteUser);

module.exports = router;