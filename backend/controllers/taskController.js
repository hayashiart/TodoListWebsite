// Importe l’objet db depuis models/index.js, qui contient le modèle Task
// Rôle : Donne accès à db.Task pour créer des tâches dans la table Tasks
// Syntaxe : require('../models') remonte au dossier models depuis controllers
// Retour : L’objet db contenant db.Task
const db = require('../models');

// Définit la fonction createTask pour la route POST /api/tasks
// Arguments :
// - req : Objet représentant la requête HTTP (contient req.body et req.user)
// - res : Objet représentant la réponse HTTP (utilisé pour envoyer une réponse)
// Retour : Aucun (envoie une réponse HTTP via res)
// Syntaxe : async permet d’utiliser await pour les opérations asynchrones
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Vérifie req.user et récupère l’id
    // Syntaxe : req.user?.id accède à l’ID de l’utilisateur décodé
    // Rôle : Associe la tâche à l’utilisateur authentifié
    console.log('req.user:', req.user);
    const userId = req.user?.id;

    // Vérifie si userId est défini
    // Syntaxe : !userId vérifie si l’ID est absent
    // Rôle : Renvoie une erreur si l’utilisateur n’est pas authentifié
    if (!userId) {
      console.error('No userId found in req.user');
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Crée une nouvelle tâche dans la table Tasks
    // Arguments : Objet contenant les champs de la tâche
    // Retour : Une promesse qui résout en l’objet tâche créé
    // Syntaxe : db.Task.create insère un enregistrement
    // Rôle : Enregistre la tâche avec userId, title et description
    const task = await db.Task.create({
      title,
      description,
      userId,
    });

    // Envoie une réponse HTTP avec la tâche créée
    // Arguments :
    // - 201 : Code HTTP pour "Created" (ressource créée)
    // - Objet JSON : Détails de la tâche
    // Syntaxe : res.status(201).json() envoie la réponse
    res.status(201).json({
      message: 'Task created',
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        userId: task.userId,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    // Gère les erreurs (ex. : validation, base de données)
    // Arguments :
    // - 400 : Code HTTP pour "Bad Request"
    // - Objet JSON : Détails de l’erreur
    // Syntaxe : res.status(400).json() envoie la réponse
    console.error('Create task error:', error.message);
    res.status(400).json({ error: error.message });
  }
};