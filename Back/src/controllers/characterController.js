const  {character_classes}  = require("../models")

module.exports = {
    getCharacter_classes : async (req,res) => {
        const charachter_classes = await character_classes.findAll()
        res.json( charachter_classes)
        
    },
    createCharacter: async(req,res) => {
        const character = character_classes.create(req.body)
        res.json(character)
    },
    getCharacterById: async(req,res) => {
        const character = character_classes.findById(id)
        res.json(character)
    }
}
