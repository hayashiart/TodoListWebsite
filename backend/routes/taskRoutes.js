// Importe Express pour créer un routeur
// Syntaxe : require('express') importe le module Express
const express = require('express');

// Importe les modèles Task et User
// Syntaxe : require('../models') importe l’objet db contenant les modèles
// Rôle : Permet d’interagir avec les tables Tasks et Users
const { Task, User } = require('../models');

// Importe le middleware auth pour protéger les routes
// Syntaxe : require('../middleware/auth') importe le middleware
// Rôle : Vérifie le token JWT pour authentifier l’utilisateur
const auth = require('../middleware/auth');

// Importe csurf pour la protection CSRF
// Syntaxe : require('csurf') importe la bibliothèque
// Rôle : Génère et valide des tokens CSRF pour les requêtes sensibles
const csurf = require('csurf');

// Crée une instance de routeur
// Syntaxe : express.Router() crée un routeur
// Rôle : Définit les endpoints pour les tâches
const router = express.Router();

// Configure csurf pour les routes sensibles
// Syntaxe : csurf({ cookie }) crée un middleware CSRF
// Arguments : cookie (objet) définit le stockage du token
// Retour : Middleware qui valide les tokens
// Rôle : Protège les routes POST, PUT, DELETE contre les attaques CSRF
const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'strict' } });

// Route POST /api/tasks : Créer une nouvelle tâche
// Syntaxe : router.post définit une route POST
// Arguments : path, middlewares (auth, csrf), controller
// Retour : Aucun, mais crée une tâche si validé
// Rôle : Crée une tâche pour l’utilisateur authentifié avec protection CSRF
router.post('/tasks', auth, csrfProtection, async (req, res) => {
  try {
    // Extrait title et description du corps de la requête
    // Syntaxe : req.body accède aux données JSON
    const { title, description } = req.body;

    // Vérifie que title est fourni
    // Syntaxe : if (!title) conditionne la réponse
    // Rôle : Empêche la création si le titre est manquant
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Crée une nouvelle tâche
    // Syntaxe : Task.create insère une ligne dans la table Tasks
    // Rôle : Enregistre la tâche avec l’userId de l’utilisateur authentifié
    const task = await Task.create({
      title,
      description,
      userId: req.user.id, // req.user.id vient du middleware auth
    });

    // Envoie une réponse avec la tâche créée
    // Syntaxe : res.status(201).json envoie une réponse JSON
    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    // Gère les erreurs (ex. : title manquant)
    // Syntaxe : res.status(400).json envoie une erreur
    res.status(400).json({ error: error.message });
  }
});

// Route GET /api/tasks : Lister les tâches de l’utilisateur
// Syntaxe : router.get définit une route GET
// Rôle : Récupère toutes les tâches de l’utilisateur authentifié
router.get('/tasks', auth, async (req, res) => {
  try {
    // Récupère les tâches de l’utilisateur
    // Syntaxe : Task.findAll avec where filtre par userId
    // Rôle : Sélectionne les tâches associées à l’utilisateur
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
    });

    // Envoie une réponse avec la liste des tâches
    // Syntaxe : res.json envoie une réponse JSON
    res.json(tasks);
  } catch (error) {
    // Gère les erreurs
    // Syntaxe : res.status(400).json envoie une erreur
    res.status(400).json({ error: error.message });
  }
});

// Route PUT /api/tasks/:id : Mettre à jour une tâche
// Syntaxe : router.put définit une route PUT
// Arguments : path, middlewares (auth, csrf), controller
// Retour : Aucun, mais met à jour une tâche si validé
// Rôle : Met à jour une tâche avec protection CSRF
router.put('/tasks/:id', auth, csrfProtection, async (req, res) => {
  try {
    // Extrait title, description, completed du corps de la requête
    // Syntaxe : req.body accède aux données JSON
    // Rôle : Récupère les champs à mettre à jour
    const { title, description, completed } = req.body;

    // Recherche la tâche par ID et userId
    // Syntaxe : Task.findOne avec where filtre par id et userId
    // Rôle : Vérifie que la tâche existe et appartient à l’utilisateur
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    // Vérifie si la tâche existe
    // Syntaxe : if (!task) conditionne la réponse
    // Rôle : Renvoie une erreur si la tâche n’est pas trouvée
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Met à jour les champs fournis
    // Syntaxe : task.update met à jour les champs spécifiés
    // Rôle : Modifie title, description, completed si fournis
    await task.update({ title, description, completed });

    // Envoie une réponse avec la tâche mise à jour
    // Syntaxe : res.json envoie une réponse JSON
    // Rôle : Confirme la mise à jour
    res.json({ message: 'Task updated', task });
  } catch (error) {
    // Gère les erreurs (ex. : problème de mise à jour)
    // Syntaxe : res.status(400).json envoie une erreur
    res.status(400).json({ error: error.message });
  }
});

// Route DELETE /api/tasks/:id : Supprimer une tâche
// Syntaxe : router.delete définit une route DELETE
// Arguments : path, middlewares (auth, csrf), controller
// Retour : Aucun, mais supprime une tâche si validé
// Rôle : Supprime une tâche avec protection CSRF
router.delete('/tasks/:id', auth, csrfProtection, async (req, res) => {
  try {
    // Recherche la tâche par ID et userId
    // Syntaxe : Task.findOne avec where filtre par id et userId
    // Rôle : Vérifie que la tâche existe et appartient à l’utilisateur
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    // Vérifie si la tâche existe
    // Syntaxe : if (!task) conditionne la réponse
    // Rôle : Renvoie une erreur si la tâche n’est pas trouvée
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Supprime la tâche
    // Syntaxe : task.destroy supprime la ligne dans la base
    // Rôle : Retire la tâche de la table Tasks
    await task.destroy();

    // Envoie une réponse de succès
    // Syntaxe : res.json envoie une réponse JSON
    // Rôle : Confirme la suppression
    res.json({ message: 'Task deleted' });
  } catch (error) {
    // Gère les erreurs (ex. : problème de suppression)
    // Syntaxe : res.status(400).json envoie une erreur
    res.status(400).json({ error: error.message });
  }
});

// Exporte le routeur
// Syntaxe : module.exports rend le routeur accessible
// Rôle : Permet son utilisation dans server.js
module.exports = router;