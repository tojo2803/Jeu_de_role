const  {Player} = require('../models');

module.exports = {
    createPLayer: async (req, res) => {
        try{
            if(req.body != null){
                console.log(Player)
                const player = Player.create(req.body)
                res.status(200).json({
                "msg": "player created",
                "player": player
            })
            }else{
                res.status(404).json({
                    "msg": "verifier votre requete que tous les champs sont bien remplie",
                })
            }
            
        }catch(error){
            res.status(404).json({
                "msg": "player not created",
                "error": error
            })
        }
    }
}