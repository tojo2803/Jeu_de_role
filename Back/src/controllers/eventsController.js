const  {events}  = require("../models")

module.exports = {
    getEvents : async (req,res) => {
        const event = await events.findAll()
        res.json(event)
        
    }
}
