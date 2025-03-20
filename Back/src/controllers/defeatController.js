const   {defeat_conditions}  = require("../models")

module.exports = {
    getDefeatCondition: async (req,res) => {
        const defeat_condition = await defeat_conditions.findAll()
        res.json(defeat_condition)
        
    }
}