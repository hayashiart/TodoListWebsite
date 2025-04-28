// Importe bcryptjs pour hasher les mots de passe
// Rôle : Transforme un mot de passe en clair en une chaîne sécurisée (ex. : "password123" devient "$2a$10$...")
// Syntaxe : require('bcryptjs') importe le module bcryptjs
// Retour : L’objet bcryptjs avec des méthodes comme hash()
const bcrypt = require('bcryptjs');

// Importe jsonwebtoken pour générer des tokens JWT
// Rôle : Crée des tokens sécurisés pour authentifier les utilisateurs
// Syntaxe : require('jsonwebtoken') importe le module jsonwebtoken
// Retour : L’objet jsonwebtoken avec des méthodes comme sign()
const jwt = require('jsonwebtoken');

// Importe l’objet db depuis models/index.js, qui contient le modèle User
// Rôle : Donne accès à db.User pour créer des utilisateurs dans la table Users
// Syntaxe : require('../models') remonte au dossier models depuis controllers
// Retour : L’objet db contenant db.User
const db = require('../models');

// Définit la fonction register pour la route POST /api/users
// Arguments :
// - req : Objet représentant la requête HTTP (contient req.body avec les données envoyées)
// - res : Objet représentant la réponse HTTP (utilisé pour envoyer une réponse au client)
// Retour : Aucun (envoie une réponse HTTP via res)
// Syntaxe : async permet d’utiliser await pour les opérations asynchrones
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: 'User created',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Définit la fonction login pour la route POST /api/login
// Arguments :
// - req : Objet représentant la requête HTTP (contient req.body avec email et password)
// - res : Objet représentant la réponse HTTP (utilisé pour envoyer un token ou une erreur)
// Retour : Aucun (envoie une réponse HTTP via res)
// Syntaxe : async permet d’utiliser await pour les opérations asynchrones
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Génère un token JWT
    // Syntaxe : jwt.sign(payload, secret, options) crée un token
    // Arguments : payload (données), secret (clé), options (expiration)
    // Retour : Token JWT
    // Rôle : Authentifie l’utilisateur pour les requêtes
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token.substring(0, 10) + '...');
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Définit la fonction getAllUsers pour la route GET /api/users
// Arguments :
// - req : Objet représentant la requête HTTP (contient req.user ajouté par le middleware)
// - res : Objet représentant la réponse HTTP (utilisé pour envoyer la liste des utilisateurs)
// Retour : Aucun (envoie une réponse HTTP via res)
// Syntaxe : async permet d’utiliser await pour les opérations asynchrones
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Définit la fonction updateUser pour la route PUT /api/user/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    await user.update(updates);
    res.status(200).json({
      message: 'User updated',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Définit la fonction deleteUser pour la route DELETE /api/user/:id
// Arguments :
// - req : Objet représentant la requête HTTP (contient req.params.id, req.user)
// - res : Objet représentant la réponse HTTP (utilisé pour envoyer la réponse)
// Retour : Aucun (envoie une réponse HTTP via res)
// Syntaxe : async permet d’utiliser await pour les opérations asynchrones
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};