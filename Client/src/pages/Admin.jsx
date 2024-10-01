import React from "react";
import {useState, useEffect} from "react";

// Admin page - for running the game
export default function Admin() {
    
    const [settlements, setSettlements] = useState([])
    const [needsUpdate, setNeedsUpdate] = useState(false)

    function updateSettlements() {
        fetch(`http://phoenix.zapto.org:3005/get/settlements`)
        .then (res => res.json())
        .then (data => setSettlements(data))
    }

    // TEMP - BAD
    // TODO - use webhooks to update on data change
    useEffect(() => {
        setTimeout(() => {
            setNeedsUpdate(false)
            updateSettlements()
        }, 500)
    }, [needsUpdate])
    useEffect(() => {
        const interval = setInterval(() => {
            updateSettlements()
        }, 5000);
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="Admin">
            <h1>Admin</h1>

            <h2>Create new Settlement</h2>
            {/*TODO*/}

            <h2>Enable/Disable Settlements</h2>
            <button onClick={() => {enableAllSettlements(); setNeedsUpdate(true)}}>Enable All</button>
            <table>
                <tr>
                    <th>Player</th>
                    <th>Resource</th>
                    <th>Roll</th>
                </tr>
                {settlements.map((settlement) => (<SettlementEntry settlement={settlement} triggerUpdate={() => {setNeedsUpdate(true)}}/>))}
            </table>
            
            <h2>Roll</h2>
            <Roller />

            <h2>Theft</h2>
            {/*TODO*/}

            <h2>Manage Player Resources</h2>
            {/*TODO*/}
            

            <h2>Reset</h2>
            <button
                id="player-button"
                type="button"
                onClick={resetAll}
>
                Full Reset
            </button>

            <h2>Log</h2>
            {/*TODO*/}
        </div>
    )
}

// Widget to display buttons for each possible dice roll
function Roller(props) {
    let possibleRolls = [2,3,4,5,6,8,9,10,11,12]
    return (
        <div>
            {possibleRolls.map((roll) => (<button onClick={() => {sendRoll(roll)}}>{roll}</button>))}
        </div>
    )
}

// Send a roll request to the API
function sendRoll(number) {
    console.log(`Rolled a ${number}`)
    fetch(`http://phoenix.zapto.org:3005/game/roll?roll=${number}`)
}

// Display a settlement, and set up onClick to enable/disable
function SettlementEntry(props) {
    return (
        <tr className={props.settlement.enabled ? "activeSettlement" : "inactiveSettlement"} onClick={() => {toggleSettlement(props.settlement.ID); props.triggerUpdate()}}> 
            <td>{props.settlement.player}</td>
            <td>{props.settlement.resource}</td>
            <td>{props.settlement.roll}</td>
        </tr>
    )
}

function enableAllSettlements() {
    fetch(`http://phoenix.zapto.org:3005/set/enableallsettlements`)
}

function toggleSettlement (ID) {
    fetch(`http://phoenix.zapto.org:3005/set/togglesettlement?ID=${ID}`)
}

function resetAll() {
    fetch("http://phoenix.zapto.org:3005/reset")
}