const express = require('express');  
const app = express(); //Cree un objet express
const mongoose = require('mongoose');  
const path = require('path'); //Ce module permet d'utiliser les chemins vers les fichiers

//Appeler le router 
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Connection a la base de données
mongoose.connect('mongodb+srv://luca_clr:RdY1nRvRph9ChFAd@cluster0.odyk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Modification des headers pour permettre d'utiliser l'api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json()); //Permet de recuperer le body des requetes

app.use('/images', express.static(path.join(__dirname, 'images'))); //Chemin vers images

app.use('/api/auth' , userRoutes)
app.use('/api/sauces' , sauceRoutes)

module.exports = app;