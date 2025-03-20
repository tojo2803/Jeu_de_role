const  {items}  = require("../models")

module.exports = {
    getItem : async (req,res) => {
        const item = await items.findAll()
        res.json( item)
        
    }
}
