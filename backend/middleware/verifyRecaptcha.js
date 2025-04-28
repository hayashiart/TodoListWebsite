// Importe axios pour envoyer des requêtes HTTP
const axios = require("axios");

// Middleware pour vérifier le token reCAPTCHA
// Syntaxe : Fonction middleware avec req, res, next
// Arguments : req (requête), res (réponse), next (suivant)
// Retour : Passe à next() si valide, sinon erreur 400
// Rôle : Vérifie que le token reCAPTCHA est valide auprès de Google
const verifyRecaptcha = async (req, res, next) => {
  // Récupère le token reCAPTCHA du corps de la requête
  // Syntaxe : req.body[key] accède au champ
  // Rôle : Extrait le token envoyé par le frontend
  const { recaptchaToken } = req.body;

  // Vérifie que le token est fourni
  // Syntaxe : if (!token) conditionne la réponse
  // Rôle : Renvoie une erreur si le token est manquant
  if (!recaptchaToken) {
    return res.status(400).json({ error: "reCAPTCHA token is required" });
  }

  try {
    // Confirme la clé secrète utilisée
    // Syntaxe : console.log affiche la clé (partiellement masquée)
    // Rôle : Vérifie que la clé est correctement lue
    console.log(
      "Using reCAPTCHA secret key:",
      process.env.RECAPTCHA_SECRET_KEY.substring(0, 6) + "..."
    );
    // Envoie une requête à l’API Google reCAPTCHA
    // Syntaxe : axios.post(url, data) envoie une requête POST
    // Arguments : url (API Google), data (token, clé secrète)
    // Retour : Promesse avec la réponse de Google
    // Rôle : Vérifie la validité du token
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      }
    );

    // Ajoute un journal détaillé pour la réponse
    // Syntaxe : console.log affiche la réponse complète
    // Rôle : Aide à déboguer les erreurs de vérification
    console.log("reCAPTCHA response:", JSON.stringify(response.data, null, 2));

    // Vérifie la réponse de Google
    // Syntaxe : response.data.success indique si le token est valide
    // Rôle : Passe à next() si valide, sinon renvoie une erreur
    if (response.data.success) {
      next();
    } else {
      // Inclut les codes d’erreur dans la réponse
      // Syntaxe : res.status(400).json envoie une erreur
      // Rôle : Fournit des détails sur l’échec
      return res.status(400).json({
        error: "reCAPTCHA verification failed",
        errorCodes: response.data["error-codes"] || "Unknown error",
      });
    }
  } catch (error) {
    // Ajoute un journal pour l’erreur
    // Syntaxe : console.error affiche l’erreur
    // Rôle : Aide à identifier les problèmes réseau
    console.error("Error verifying reCAPTCHA:", error.message);
    res.status(400).json({ error: "Error verifying reCAPTCHA" });
  }
};

module.exports = verifyRecaptcha;
