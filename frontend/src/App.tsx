// Importe React pour créer des composants
// Syntaxe : import React from 'react' importe la bibliothèque React
import React, { FC } from 'react';

// Importe les styles CSS
// Syntaxe : import './App.css' importe le fichier CSS
// Rôle : Applique les styles pour la barre de navigation
import './App.css';

// Importe les composants Register, Login, TaskList
// Syntaxe : import ... from ... pointe vers les fichiers dans src/components
// Rôle : Permet d’afficher les formulaires et la liste des tâches
import Register from './components/Register';
import Login from './components/Login';
import TaskList from './components/TaskList';

// Importe les outils de navigation de react-router-dom
// Syntaxe : import { ... } from 'react-router-dom' importe les outils de routage
// Rôle : Permet de naviguer entre les pages et protéger les routes
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Définit le composant Navigation pour gérer la barre de navigation
// Syntaxe : FC définit un composant fonctionnel avec TypeScript
// Rôle : Affiche les liens et le bouton de déconnexion conditionnel
const Navigation: FC = () => {
  // Utilise useNavigate pour rediriger programmatiquement
  // Syntaxe : useNavigate() retourne une fonction de navigation
  // Rôle : Permet de rediriger vers /login après déconnexion
  const navigate = useNavigate();

  // Définit la fonction handleLogout pour gérer la déconnexion
  // Syntaxe : fonction fléchée sans arguments
  // Rôle : Supprime le token et redirige vers /login
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Retourne le JSX pour afficher la navigation
  // Syntaxe : JSX décrit la barre de navigation
  // Rôle : Affiche les liens et le bouton de déconnexion si connecté
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/tasks">Tasks</Link>
        </li>
        {/* Bouton de déconnexion, visible seulement si connecté */}
        {/* Syntaxe : condition token && affiche le bouton si token existe */}
        {/* Rôle : Affiche le bouton vert quand l’utilisateur est connecté */}
        {localStorage.getItem('token') && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

// Interface pour les props de ProtectedRoute
// Syntaxe : interface définit les types des props
// Rôle : Typage pour le composant ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Définit le composant ProtectedRoute pour protéger les routes
// Syntaxe : FC<ProtectedRouteProps> définit un composant avec props typés
// Rôle : Protège les routes en vérifiant l’authentification
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  // Vérifie la présence d’un token dans localStorage
  // Syntaxe : localStorage.getItem récupère une valeur
  // Rôle : Détermine si l’utilisateur est authentifié
  const token = localStorage.getItem('token');

  // Si aucun token, redirige vers /login
  // Syntaxe : <Navigate> redirige vers une URL
  // Rôle : Empêche l’accès non authentifié
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si token présent, rend le composant enfant
  // Syntaxe : return children rend le composant
  // Rôle : Affiche la page protégée
  return <>{children}</>;
};

// Définit le composant App
// Syntaxe : FC définit un composant fonctionnel avec TypeScript
// Rôle : Rend l’application avec navigation et routes
const App: FC = () => {
  // Retourne le JSX pour afficher la navigation et les routes
  // Syntaxe : JSX avec Router encapsule l’application
  return (
    <Router>
      <div>
        {/* Affiche la barre de navigation */}
        <Navigation />

        {/* Définit les routes de l’application */}
        <Routes>
          {/* Route pour l’URL racine */}
          <Route path="/" element={<Login />} />
          {/* Route pour l’inscription */}
          <Route path="/register" element={<Register />} />
          {/* Route pour la connexion */}
          <Route path="/login" element={<Login />} />
          {/* Route protégée pour les tâches */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

// Exporte le composant App
// Syntaxe : export default pour utilisation dans index.tsx
export default App;