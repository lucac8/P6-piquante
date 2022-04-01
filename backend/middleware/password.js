const passwordValidator = require('password-validator')

const passwordSchema = new passwordValidator()

passwordSchema
.is().min(5)                                    // Minimum longueur 5
.is().max(50)                                   // Maximum longueur 50
.has().uppercase()                              // UNE MAJ
.has().lowercase()                              // UNE MIN
.has().digits(2)                                // 2 chiffres
.has().not().spaces()                           // Pas d'espace 

module.exports = (req , res , next) => {           //Si password valide passe au prochain middleware
    if(passwordSchema.validate(req.body.password)) {
        next()
    }else{
        return res.status(400).json({error : "Le mot de passe n'est pas assez fort" })
    }
}