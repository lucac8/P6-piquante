const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");



exports.signup = (req, res, next) => {
    const emailCryptoJS = CryptoJS.HmacSHA256(req.body.email, "KT9J3zE9xz38yR3r").toString()       //Cryptage de l'adresse mail 
    bcrypt.hash(req.body.password, 10) //On recupere le mdp de la requete     10 = le salage du hachage
        .then(hash => {
            const user = new User({        //Creation de l'user avec le schema et le mdp hasher
                email: emailCryptoJS,
                password: hash
            });
            user.save()             //Sauvegarde ds la base 
              .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
              .catch(error => res.status(400).json({ error }));
          })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const emailCryptoJS = CryptoJS.HmacSHA256(req.body.email, "KT9J3zE9xz38yR3r").toString() //Cryptage de l'adresse mail pour la chercher ds la base de données
    User.findOne({ email: emailCryptoJS })      
      .then(user => { 
        if (!user) { //Pas bon email
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)  //Sinon bcrypt compare le mdp texte avec celui en hash (renvoie true/false)
          .then(valid => {
            if (!valid) { //Si different error 
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,     
              token: jwt.sign(             //Creation du token
                { userId: user._id },
                '6893NFhQ4ykvYdD2',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
