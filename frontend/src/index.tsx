// Importe React pour le rendu
// Syntaxe : import React from 'react' importe la bibliothèque React
import React from 'react';

// Importe createRoot pour le rendu de l’application
// Syntaxe : import { createRoot } from 'react-dom/client' importe l’API de rendu
// Rôle : Rend l’application dans le DOM
import { createRoot } from 'react-dom/client';

// Importe l’application principale
// Syntaxe : import App from './App' importe le composant App
// Rôle : Charge le composant racine
import App from './App';

// Importe les styles globaux (si présents)
// Syntaxe : import './index.css' importe le fichier CSS
// Rôle : Applique les styles globaux
import './index.css';

// Sélectionne l’élément racine du DOM
// Syntaxe : document.getElementById sélectionne un élément par ID
// Rôle : Cible l’élément où l’application sera rendue
const container = document.getElementById('root')!;

// Crée une racine pour le rendu
// Syntaxe : createRoot crée une racine de rendu
// Rôle : Initialise le rendu de React
const root = createRoot(container);

// Rend l’application
// Syntaxe : root.render rend le composant dans le DOM
// Rôle : Affiche l’application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);