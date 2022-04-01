const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];     //On recupere seulement le token chiffré 
    const decodedToken = jwt.verify(token, '6893NFhQ4ykvYdD2');  //On decode avec la clé secrete 
    const userId = decodedToken.userId;       
    req.auth = {userId}; //On transmet l'userId 
    if (req.body.userId && req.body.userId !== userId) { //Si la requete a un id et qu'il est different de celui du token => error
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};