const express = require("express")
const playerController = require("../controllers/playerController")


exports.router = (function () {
    const router = express.Router();
    //route de l'api Player
    router.route('/createPlayer').post(playerController.createPLayer) //ok
    return router;
})();