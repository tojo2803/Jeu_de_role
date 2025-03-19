const express = require("express")
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./src/routes/route').router;
const app = express()

app.use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:true}))
    .use('/api',router)


app.listen(process.env.BACK_PORT, () => {
    console.log(`server running : http://${process.env.BACK_HOST}:${process.env.BACK_PORT}` )
})