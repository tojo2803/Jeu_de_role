const express = require("express")
require('dotenv').config();
const app = express()

const Port  = process.env.PORT || 3000
app.listen(Port, () => {
    console.log("serverlancé sur le projet ${Port}")
    console.log(Port)
})