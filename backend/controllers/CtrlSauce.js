const Sauce = require('../models/Sauce')
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.createSauce = (req, res, next) => {
    console.log(req.body.sauce)
    const sauceObject = JSON.parse(req.body.sauce) //Transforme les info de la requete en obj js
    delete  sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,     //Remplie le schema avec les info de la requete
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // Le lien vers l'image : protocole(=http) host=(localhost) 
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})  //Cherche ds la base de données la sauce qui a l'id mis en parametre 
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.deleteSauce = (req, res, next) => {      
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (!sauce) {            //Si on ne trouve pas la sauce 
          res.status(404).json({
            error: new Error('No such sauce!')
          });
        }
        if (sauce.userId !== req.auth.userId) {      //Si id du createur de la sauce est different que celui qui veut la supprimer
          res.status(400).json({
            error: new Error('Unauthorized request!')
          });
        }else{
        const filename = sauce.imageUrl.split('/images/')[1];       //On recupere tout ce qui est apres le /images/
        fs.unlink(`images/${filename}`, () => {            //Supprime le fichier puis appel une callback 
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        });
        }
      }
    ).catch((error) => {res.status(400).json({error})
    })
}

exports.likeSauce = (req, res, next) => {
  switch(req.body.like) {
      case 1 :    //(like)
          Sauce.updateOne({_id: req.params.id} , {$push : {usersLiked: req.body.userId} , $inc: {likes: +1}})
          .then(() => res.status(200).json({ message: 'Like ajouté !'}))
          .catch(error => res.status(400).json({ error }));
          break;

      case -1 : //(dislike)
          Sauce.updateOne({_id: req.params.id} , {$push : {usersDisliked: req.body.userId} , $inc: {dislikes: +1}})
          .then(() => res.status(200).json({ message: 'Dislike ajouté !'}))
          .catch(error => res.status(400).json({ error }));
          break;
        
      case 0 : 
          Sauce.findOne({_id: req.params.id})   //On recupere la sauce 
          .then(sauce => {
            if(sauce.usersLiked.includes(req.body.userId)) { //Avec la sauce on cherche ds le tab des like si l'user a mit un like 
              Sauce.updateOne({_id: req.params.id} , {$pull : {usersLiked: req.body.userId} , $inc: {likes: -1}})
              .then(() => res.status(200).json({ message: 'Like supprimé !'}))
              .catch(error => res.status(400).json({ error }));
            }else { //Sinon on enleve son dislike
              Sauce.updateOne({_id: req.params.id} , {$pull : {usersDisliked: req.body.userId} , $inc: {dislikes: -1}})
              .then(() => res.status(200).json({ message: 'Dislike supprimé !'}))
              .catch(error => res.status(400).json({ error }));
            }
          }) 
          .catch(error => res.status(404).json({ error }));
      break;
  }   
}
   
exports.modifySauce = (req, res, next) => {  //Req = sauce et images : file
  Sauce.findOne({ _id: req.params.id }).then( 
    (sauce) => {
      if (!sauce) {            
        res.status(404).json({
          error: new Error('No such sauce!')
        });
      }
      if (sauce.userId !== req.auth.userId) {      
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }else{
        console.log(sauce.imageUrl)
        console.log(req.body)                                        
        if(req.file) {                                              //Si modification de l'image suppresion de l'ancienne
          const filename = sauce.imageUrl.split('/images/')[1];       
          fs.unlink(`images/${filename}`, () => { console.log('Image supp') }) 
        }
        const sauceObject = req.file ? 
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        : { ...req.body };

        Sauce.updateOne({ _id: req.params.id },{ ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modifiée." }))
        .catch((error) => res.status(400).json({ error }));
      }
    }
  ).catch((error) => {res.status(400).json({error}) })
}
  
 