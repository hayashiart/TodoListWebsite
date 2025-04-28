-- Crée la table Users
-- Syntaxe : CREATE TABLE définit une table
-- Rôle : Stocke les informations des utilisateurs
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crée la table Tasks
-- Syntaxe : CREATE TABLE définit une table
-- Rôle : Stocke les informations des tâches
CREATE TABLE "Tasks" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  "userId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
);