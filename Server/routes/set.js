var express = require('express');
var router = express.Router();
const {Settlement} = require('../classes.js')

let DB;

// Add a specified resource to a specified player
// Can specify quantity (including negative), but defaults to 1
router.get('/resource', async function(req, res, next) {
    DB = req.DB;

    // Make sure player and resource were specified
    if (!req.query.player || !req.query.resource) {
        sendError(res, 400, "Invalid parameters")
        return;
    }
    const player = req.query.player;
    const resource = req.query.resource;

    // See if quantity was specified, if not set to default
    let quantity;
    if (req.query.quantity) {
        quantity = parseInt(req.query.quantity);
    } else {
        quantity = 1;
    }

    // Make sure specified resource is valid
    switch(resource) {
        case "gold":
        case "wood":
        case "clay":
        case "hay":
        case "stone":
        case "sheep":
            break;
        default:
            sendError(res, 400, "Invalid resource");
            return;
    }

    // Make sure specified player exists
    if (!DB.indexes.includes(player)) {
        sendError(res, 400, "Invalid player name");
        return;
    }

    // Fetch player data
    let thisPlayer = await DB.get(player)
    // Update their resources
    thisPlayer.resources[resource] += quantity;
    DB.set(player, thisPlayer);
    res.json("OK");
});

// Add a harbour to a player
router.get('/addharbour', async function(req, res, next) {
    DB = req.DB;

    // Check that both player and harbour resource type are specified
    if (!req.query.player || !req.query.resource) {
        sendError(res, 400, "Invalid parameters")
        return;
    }
    const player = req.query.player;
    const resource = req.query.resource;

    // Check harbour type is valid
    switch(resource) {
        case "any":
        case "wood":
        case "clay":
        case "hay":
        case "stone":
        case "sheep":
            break;
        default:
            sendError(res, 400, "Invalid resource");
            return;
    }

    // Check player exists
    if (!DB.indexes.includes(player)) {
        sendError(res, 400, "Invalid player name");
        return;
    }

    // Fetch player information
    let thisPlayer = await DB.get(player)
    // Update harbour info
    thisPlayer.harbours[resource] = true;
    DB.set(player, thisPlayer);
    res.json("OK");
});

// Add a new settlement to the database
// Requires an owqning player, produced resource, and triggering roll
router.get('/createsettlement', async function(req, res, next) {
    DB = req.DB;

    // Make sure all parameters were passed
    if (!req.query.player || !req.query.resource || !req.query.roll) {
        sendError(res, 400, "Invalid parameters")
        return;
    }
    const player = req.query.player;
    const resource = req.query.resource;
    const roll = parseInt(req.query.roll);

    // Make sure resource type is valid
    switch(resource) {
        case "gold":
        case "wood":
        case "clay":
        case "hay":
        case "stone":
        case "sheep":
            break;
        default:
            sendError(res, 400, "Invalid resource");
            return;
    }

    // Make sure player exists
    if (!DB.indexes.includes(player)) {
        sendError(res, 400, "Invalid player name");
        return;
    }

    // Make sure roll is valid
    if (roll <2 || roll == 7 || roll > 12) {
        sendError(res, 400, "Invalid roll")
        return;
    }

    // Fetch settlement info
    settlements = await DB.get("settlements")

    // Add the new one to the DB - use the current array length as its unique ID
    await DB.push("settlements", new Settlement(settlements.length, player, resource, roll))
    
    res.json("OK");
});

// Enable or disable a given settlement by its unique ID
router.get('/togglesettlement', async function(req, res, next) {
    DB = req.DB;

    // Make sure ID is supplied
    if (!req.query.ID) {
        sendError(res, 400, "Invalid parameters")
        return;
    }
    const ID = parseInt(req.query.ID);

    // Make sure the ID could be valid
    if (isNaN(ID)) {
        sendError(res, 400, "Invalid ID")
        return;
    }

    // Fetch settlement data
    let settlements = await DB.get("settlements")

    // Make sure the ID IS valid
    if (ID < 0 || ID >= settlements.length) {
        sendError(res, 400, "ID Not Found")
        return;
    }

    // Toggle enabled state and save
    settlements[ID].enabled = !settlements[ID].enabled
    await DB.set("settlements", settlements)
    
    res.json("OK");
});

// Set all settlements to enabled (e.g. Robber has just been rolled and is moving somewhere new)
router.get('/enableallsettlements', async function(req, res, next) {
    DB = req.DB;

    // Fetch settlement data
    let settlements = await DB.get("settlements")

    // Iterate through all of them
    for (let settlement of settlements) {
        // Enable
        settlement.enabled = true
    }

    // Save
    await DB.set("settlements", settlements)
    
    res.json("OK");
});

module.exports = router;

// Boilerplate to send an error response
function sendError(res, code, message) {
    res.status(code);
    res.json({"error": true, "message": message})
}