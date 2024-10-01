const express = require('express');
const router = express.Router();
const {Player} = require('../classes.js')


let DB;

// Get the whole DB - debug purposes only
router.get('/', async function (req, res, next) {
    DB = req.DB;
    let names = DB.indexes;
    let result = [];
    for (let name of names) {
        result.push(DB.get(name))
    }
    res.json(result);
});

// Get the settlements list
router.get('/settlements', async function (req, res, next) {
    DB = req.DB;
    let settlements = DB.get("settlements")

    res.json(settlements);
});

// Get the list of players
router.get('/players', async function (req, res, next) {
    DB = req.DB;
    let names = DB.indexes;
    let result = [];
    for (let name of names) {
        // Ignore the "settlements" database entry
        if (name === "settlements") {continue;}
        result.push(DB.get(name).name)
    }
    res.json(result);
});

// Get a specific player
router.get('/player/:name', async function(req, res, next) {
    DB = req.DB;
    let result = await getPlayer(req.params.name)
    if (result === null) {
        // Player not found
        sendError(res, 400, "Invalid player name")
        return;
    }
    res.json(result);
});

module.exports = router;

// Helper function to retrieve a specific player from the DB
// If the player doesn't exist, create them
async function getPlayer(name) {
    if (!DB.indexes.includes(name)) {
        if (name === "settlements") {
            return null;
        }
        await addPlayer(name);
    }
    const target = await DB.get(name);
    return target;
}

// Helper function to create a new player entry
async function addPlayer(name) {
    console.log(`Creating ${name}`)
    if (!DB.indexes.includes(name)) {
        await DB.set(name, new Player(name));
    }
}

// Boilerplate to send an error response
function sendError(res, code, message) {
    res.status(code);
    res.json({"error": true, "message": message})
}
