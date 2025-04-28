// Définit une fonction pour créer le modèle Task
// Arguments :
// - sequelize : Instance Sequelize pour la connexion
// - DataTypes : Types de données Sequelize
// Retour : Modèle Task
// Syntaxe : fonction exportée pour éviter les importations circulaires
// Rôle : Crée le modèle Task avec les champs spécifiés
module.exports = (sequelize, DataTypes) => {
  // Définit le modèle Task
  // Arguments :
  // - Nom du modèle : 'Task'
  // - Schéma : Objet définissant les colonnes et leurs types
  // - Options : Configuration du modèle
  // Syntaxe : sequelize.define crée un modèle Sequelize
  // Rôle : Crée la table Tasks avec les champs spécifiés
  const Task = sequelize.define('Task', {
    // Colonne id : Identifiant unique de la tâche
    // Syntaxe : DataTypes.INTEGER pour un entier
    // Rôle : Clé primaire auto-incrémentée
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Colonne title : Titre de la tâche
    // Syntaxe : DataTypes.STRING(255) pour une chaîne de 255 caractères
    // Rôle : Stocke le titre (ex. : "Acheter du lait")
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Colonne description : Description optionnelle
    // Syntaxe : DataTypes.TEXT pour un texte long
    // Rôle : Stocke une description détaillée
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Colonne completed : Statut de complétion
    // Syntaxe : DataTypes.BOOLEAN pour vrai/faux
    // Rôle : Indique si la tâche est terminée (par défaut : false)
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // Colonne userId : Clé étrangère liant la tâche à un utilisateur
    // Syntaxe : DataTypes.INTEGER pour un entier
    // Rôle : Associe la tâche à l’utilisateur qui l’a créée
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    // Colonne createdAt : Date de création
    // Syntaxe : DataTypes.DATE pour un timestamp
    // Rôle : Enregistre la date de création
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    // Colonne updatedAt : Date de mise à jour
    // Syntaxe : DataTypes.DATE pour un timestamp
    // Rôle : Enregistre la date de mise à jour
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    // Options du modèle
    // Syntaxe : tableName définit le nom exact de la table
    // Rôle : Force le nom de table à 'Tasks'
    tableName: 'Tasks',
    // Syntaxe : timestamps gère createdAt et updatedAt
    // Rôle : Active les colonnes de date
    timestamps: true,
  });

  // Définit les relations du modèle
  // Syntaxe : Task.associate = (models) => { ... } définit les relations
  // Arguments : models (objet contenant les autres modèles)
  // Retour : Aucun, mais établit les relations
  // Rôle : Associe Task à User via userId
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  // Retourne le modèle Task
  // Syntaxe : return rend le modèle accessible
  // Rôle : Permet son utilisation dans index.js
  return Task;
};