const express = require("express")
const characterController = require("../controllers/characterController")
const avatarController = require("../controllers/avatarController")
const itemsController = require("../controllers/itemsController");
const eventsController = require("../controllers/eventsController");
const victoryController = require("../controllers/victoryController")
const defeatController = require("../controllers/defeatController")
exports.router = (function () {
    const router = express.Router();
    //route de l'api Player
    router.route('/character-classes').get(characterController.getCharacter_classes)
    router.route('/characters').post(characterController.createCharacter) //ok
    router.route('/characters/:id').get(characterController.getCharacterById)
    router.route('/avatars').get(avatarController.getAvatar)
    router.route('/items').get(itemsController.getItem)
    router.route('/events').get(eventsController.getEvents)
    router.route('/victor-conditions').get(victoryController.victory_conditions)
    router.route('/defeat-conditions').get(defeatController.getDefeatCondition)
    return router;
})();