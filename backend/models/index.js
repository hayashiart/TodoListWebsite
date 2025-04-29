// Importe Sequelize pour créer une instance de connexion
// Syntaxe : require('sequelize') importe le module Sequelize
const { Sequelize, DataTypes } = require('sequelize');

// Crée une instance Sequelize pour PostgreSQL
// Arguments :
// - URL : process.env.DATABASE_URL (ex. : postgres://postgres:postgres123@postgres:5432/todolist)
// - Options : dialecte, désactivation SSL, logs
// Syntaxe : new Sequelize crée une connexion
// Rôle : Connecte l’application à la base PostgreSQL via l’URL de docker-compose
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: false, // Désactive SSL pour la connexion locale
  },
  logging: console.log, // Active les logs SQL pour déboguer
});

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