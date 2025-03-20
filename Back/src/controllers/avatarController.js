const  { avatars }  = require("../models")

module.exports = {
    getAvatar : async (req,res) => {
       const avatar =  await avatars.findAll()
        res.json(avatar)
        
    }
}
