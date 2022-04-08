const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({          //Config les fichiers entrants
  destination: (req, file, callback) => {       //Doit enregister ds dossier images
    callback(null, 'images');
  },
  filename: (req, file, callback) => {      //Renvoie un nom sans espace un nbr de miliseconde et l'extension 
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); //exporte multer config pour les images

