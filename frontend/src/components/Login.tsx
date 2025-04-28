import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../axios';
import './Login.css';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('L’email est requis'),
  password: Yup.string()
    .required('Le mot de passe est requis'),
});

const Login: FC = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);

      try {
        // Envoie la requête de connexion
        // Syntaxe : axios.post(url, data) envoie une requête POST
        // Arguments : url (endpoint), data (email, password)
        // Retour : Promesse avec la réponse
        // Rôle : Authentifie l’utilisateur et récupère le token
        const response = await axios.post<{ token: string }>('/api/login', {
          email: values.email,
          password: values.password,
        });

        // Stocke le token dans localStorage
        // Syntaxe : localStorage.setItem(key, value) stocke une valeur
        // Arguments : key (nom), value (token JWT)
        // Rôle : Permet aux requêtes suivantes d’utiliser le token
        localStorage.setItem('token', response.data.token);

        window.location.href = '/tasks';
      } catch (error: any) {
        const errorMessage = error.response?.data.error || 'Échec de la connexion';
        setFieldError('email', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login">
      <h2>Login</h2>
      {/* Formulaire lié à Formik */}
      <form onSubmit={formik.handleSubmit}>
        {/* Champ email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {/* Affiche l’erreur email */}
          {formik.touched.email && formik.errors.email && (
            <p className="error">{formik.errors.email}</p>
          )}
        </div>
        {/* Champ mot de passe */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {/* Affiche l’erreur mot de passe */}
          {formik.touched.password && formik.errors.password && (
            <p className="error">{formik.errors.password}</p>
          )}
        </div>
        {/* Bouton de soumission */}
        <button type="submit" disabled={formik.isSubmitting}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
/*
// Importe React et useState pour gérer l’état
// Syntaxe : import { useState } from 'react' importe les hooks
import React, { FC, FormEvent, useState } from 'react';

// Importe axios pour effectuer des requêtes HTTP
// Syntaxe : import axios from 'axios' importe la bibliothèque axios
// Rôle : Permet d’envoyer des requêtes POST à /api/login
import axios from 'axios';

// Importe les styles CSS
// Syntaxe : import './Login.css' importe le fichier CSS
// Rôle : Applique les styles définis dans Login.css
import './Login.css';

// Interface pour l’état du formulaire
// Syntaxe : interface définit les types des champs
// Rôle : Typage pour les données du formulaire
interface LoginFormState {
  email: string;
  password: string;
  error: string;
}

// Définit le composant Login
// Syntaxe : FC définit un composant fonctionnel avec TypeScript
// Rôle : Affiche un formulaire pour la connexion
const Login: FC = () => {
  // Crée une variable d’état pour les champs du formulaire
  // Syntaxe : useState initialise avec un objet typé
  // Rôle : Stocke email, mot de passe, et message d’erreur
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    error: '',
  });

  // Définit la fonction handleLogin pour gérer la soumission
  // Arguments : event (événement de soumission du formulaire)
  // Syntaxe : async pour utiliser await avec les requêtes HTTP
  // Rôle : Envoie les données de connexion à l’API
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState((prev) => ({ ...prev, error: '' }));

    try {
      // Envoie une requête POST à l’API pour connecter l’utilisateur
      // Syntaxe : axios.post envoie une requête POST
      // Rôle : Authentifie l’utilisateur
      const response = await axios.post<{ token: string }>('http://localhost:5000/api/login', {
        email: formState.email,
        password: formState.password,
      });

      // Stocke le token dans localStorage
      // Syntaxe : localStorage.setItem enregistre une valeur
      // Rôle : Conserve le token pour l’authentification
      localStorage.setItem('token', response.data.token);

      // Redirige vers la page des tâches
      // Syntaxe : window.location.href change l’URL
      // Rôle : Redirige après une connexion réussie
      window.location.href = '/tasks';
    } catch (error: any) {
      // Gère les erreurs (ex. : identifiants incorrects)
      // Syntaxe : error.response?.data.error accède à l’erreur de l’API
      // Rôle : Affiche un message d’erreur
      setFormState((prev) => ({
        ...prev,
        error: error.response?.data.error || 'Failed to login',
      }));
    }
  };

  // Retourne le JSX pour afficher le formulaire
  // Syntaxe : JSX décrit l’interface utilisateur
  // Rôle : Affiche un formulaire de connexion
  return (
    <div className="login">
      <h2>Login</h2>
      {formState.error && <p className="error">{formState.error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formState.password}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Exporte le composant Login
// Syntaxe : export default pour utilisation dans App.tsx
export default Login;
*/