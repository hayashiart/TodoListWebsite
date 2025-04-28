import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../axios';
import './Register.css';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('L’email est requis'),
  password: Yup.string()
    .min(8, 'Le mot de passe doit avoir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
    )
    .required('Le mot de passe est requis'),
});

const Register: FC = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);

      try {
        // Envoie la requête sans reCAPTCHA
        // Syntaxe : axios.post(url, data) envoie une requête POST
        // Arguments : url (endpoint), data (email, password)
        // Retour : Promesse avec la réponse
        // Rôle : Soumet les données au backend
        await axios.post('/api/register', {
          email: values.email,
          password: values.password,
        });

        window.location.href = '/login';
      } catch (error: any) {
        const errorMessage = error.response?.data.error || 'Échec de l’inscription';
        setFieldError('email', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="register">
      <h2>Register</h2>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

/*
// Importe React et useState pour gérer l’état
// Syntaxe : import { useState } from 'react' importe les hooks
import React, { FC, FormEvent, useState } from 'react';

// Importe axios pour effectuer des requêtes HTTP
// Syntaxe : import axios from 'axios' importe la bibliothèque axios
// Rôle : Permet d’envoyer des requêtes POST à /api/register
import axios from 'axios';

// Importe les styles CSS
// Syntaxe : import './Register.css' importe le fichier CSS
// Rôle : Applique les styles définis dans Register.css
import './Register.css';

// Interface pour l’état du formulaire
// Syntaxe : interface définit les types des champs
// Rôle : Typage pour les données du formulaire
interface RegisterFormState {
  email: string;
  password: string;
  error: string;
}

// Définit le composant Register
// Syntaxe : FC définit un composant fonctionnel avec TypeScript
// Rôle : Affiche un formulaire pour l’inscription
const Register: FC = () => {
  // Crée une variable d’état pour les champs du formulaire
  // Syntaxe : useState initialise avec un objet typé
  // Rôle : Stocke email, mot de passe, et message d’erreur
  const [formState, setFormState] = useState<RegisterFormState>({
    email: '',
    password: '',
    error: '',
  });

  // Définit la fonction handleRegister pour gérer la soumission
  // Arguments : event (événement de soumission du formulaire)
  // Syntaxe : async pour utiliser await avec les requêtes HTTP
  // Rôle : Envoie les données d’inscription à l’API
  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState((prev) => ({ ...prev, error: '' }));

    try {
      // Envoie une requête POST à l’API pour créer un utilisateur
      // Syntaxe : axios.post envoie une requête POST
      // Rôle : Enregistre l’utilisateur
      await axios.post('http://localhost:5000/api/register', {
        email: formState.email,
        password: formState.password,
      });

      // Redirige vers la page de connexion
      // Syntaxe : window.location.href change l’URL
      // Rôle : Redirige après une inscription réussie
      window.location.href = '/login';
    } catch (error: any) {
      // Gère les erreurs (ex. : email déjà utilisé)
      // Syntaxe : error.response?.data.error accède à l’erreur de l’API
      // Rôle : Affiche un message d’erreur
      setFormState((prev) => ({
        ...prev,
        error: error.response?.data.error || 'Failed to register',
      }));
    }
  };

  // Retourne le JSX pour afficher le formulaire
  // Syntaxe : JSX décrit l’interface utilisateur
  // Rôle : Affiche un formulaire d’inscription
  return (
    <div className="register">
      <h2>Register</h2>
      {formState.error && <p className="error">{formState.error}</p>}
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

// Exporte le composant Register
// Syntaxe : export default pour utilisation dans App.tsx
export default Register;

*/