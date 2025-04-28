// Importe Sequelize pour créer une instance de connexion
// Syntaxe : require('sequelize') importe le module Sequelize
const { Sequelize, DataTypes } = require('sequelize');

// Importe dotenv pour charger les variables d’environnement
// Syntaxe : require('dotenv') importe le module dotenv
const dotenv = require('dotenv');

// Charge les variables d’environnement depuis .env
// Syntaxe : dotenv.config avec chemin absolu
// Rôle : Accède aux variables DB_HOST, DB_USER, etc.
dotenv.config({ path: '/home/seblin/todo-list/.env' });

// Crée une instance Sequelize pour PostgreSQL
// Arguments :
// - Nom de la base : process.env.DB_NAME (todolist)
// - Utilisateur : process.env.DB_USER (postgres)
// - Mot de passe : process.env.DB_PASSWORD (postgres123)
// - Options : hôte, port, dialecte
// Syntaxe : new Sequelize crée une connexion
// Rôle : Connecte l’application à la base PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  }
);

// Définit l’objet db pour stocker les modèles et l’instance
// Syntaxe : objet littéral
// Rôle : Centralise les modèles et la connexion
const db = {};

// Ajoute l’instance Sequelize et sequelize à db
// Syntaxe : affectation directe
// Rôle : Permet l’accès à Sequelize (pour DataTypes) et sequelize (instance)
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importe les modèles User et Task après l’initialisation
// Syntaxe : require('./User') et require('./Task') importent les modèles
// Rôle : Charge les définitions des modèles et les associe à sequelize
db.User = require('./User')(sequelize, DataTypes);
db.Task = require('./Task')(sequelize, DataTypes);

// Définit la relation entre User et Task
// Syntaxe : hasMany et belongsTo définissent une relation 1:N
// Rôle : Un utilisateur peut avoir plusieurs tâches, une tâche appartient à un utilisateur
db.User.hasMany(db.Task, { foreignKey: 'userId' });
db.Task.belongsTo(db.User, { foreignKey: 'userId' });

// Exporte l’objet db
// Syntaxe : module.exports rend db accessible
// Rôle : Permet l’utilisation des modèles dans l’application
module.exports = db;