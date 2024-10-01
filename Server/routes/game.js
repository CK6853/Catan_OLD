const express = require('express');
const router = express.Router();

// Submit a roll action
router.get('/roll', async function (req, res, next) {

    // If no roll parameter passed, fail
    if (!req.query.roll) {
        sendError(res, 400, "Invalid parameters")
        return;
    }
    // Turn it into an integer
    const roll = parseInt(req.query.roll);

    // Make sure it's actually a number we can roll on two dice
    if (roll < 2 || roll > 12) {
        sendError(res, 400, "Invalid roll")
        return
    }

    // Special action if a 7 is rolled
    // TODO
    if (roll === 7) {
        res.json("Robber");
        return;
    }

    // Get the database, filtered to activated settlements
    // i.e. they trigger on this roll and are not disabled
    let DB = req.DB
    let settlements = await DB.get("settlements")
    settlements = settlements.filter((settlement) => settlement.enabled === true && settlement.roll == roll)

    // Iterate through activated settlements
    let thisPlayer
    for (let settlement of settlements) {
        // Find the Player who owns this settlement
        thisPlayer = await DB.get(settlement.player)
        // Add this resource
        thisPlayer.resources[settlement.resource]++
        // Save to DB
        await DB.set(thisPlayer.name, thisPlayer)
    }
    
    res.json("OK");
});

module.exports = router;


// Boilerplate to send an error response
function sendError(res, code, message) {
    res.status(code);
    res.json({"error": true, "message": message})
}