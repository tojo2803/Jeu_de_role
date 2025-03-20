const  {victory_conditions}  = require("../models")

module.exports = {
    victory_conditions : async (req,res) => {
        const victory_condition = await victory_conditions.findAll()
        res.json(victory_condition)    
    }
}
