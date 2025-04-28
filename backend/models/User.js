// Définit une fonction pour créer le modèle User
// Arguments :
// - sequelize : Instance Sequelize pour la connexion
// - DataTypes : Types de données Sequelize
// Retour : Modèle User
// Syntaxe : fonction exportée pour éviter les importations circulaires
// Rôle : Crée le modèle User avec les champs spécifiés
module.exports = (sequelize, DataTypes) => {
  // Définit le modèle User
  // Arguments :
  // - Nom du modèle : 'User'
  // - Schéma : Objet définissant les colonnes et leurs types
  // - Options : Configuration du modèle
  // Syntaxe : sequelize.define crée un modèle Sequelize
  // Rôle : Crée la table Users avec les champs spécifiés
  const User = sequelize.define('User', {
    // Colonne id : Identifiant unique de l’utilisateur
    // Syntaxe : DataTypes.INTEGER pour un entier
    // Rôle : Clé primaire auto-incrémentée
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Colonne email : Adresse email de l’utilisateur
    // Syntaxe : DataTypes.STRING(255) pour une chaîne de 255 caractères
    // Rôle : Stocke l’email, unique
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    // Colonne password : Mot de passe haché
    // Syntaxe : DataTypes.STRING(255) pour une chaîne de 255 caractères
    // Rôle : Stocke le mot de passe haché
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    // Rôle : Force le nom de table à 'Users'
    tableName: 'Users',
    // Syntaxe : timestamps gère createdAt et updatedAt
    // Rôle : Active les colonnes de date
    timestamps: true,
  });

  // Retourne le modèle User
  // Syntaxe : return rend le modèle accessible
  // Rôle : Permet son utilisation dans index.js
  return User;
};