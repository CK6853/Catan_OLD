import {useEffect, useState} from "react";
import {useParams} from "react-router-dom"

// Constants
const resources = ["wood", "sheep", "clay", "stone", "hay", "gold"];
const harbours = ["wood", "sheep", "clay", "stone", "hay", "any"];

// Player page - for displaying player resources and options
export default function Player() {
    // Figure out the current player
    let {player} = useParams();

    // Keep track of our specific player's state
    const [playerData, setPlayerData] = useState({
        "name": "Loading...",
        "resources": {
            "gold": 0,
            "wood": 0,
            "sheep": 0,
            "stone": 0,
            "clay": 0,
            "hay": 0
        },
        "harbours": {
            "any": false,
            "wood": false,
            "sheep": false,
            "stone": false,
            "clay": false,
            "hay": false
        }
    });

    // Fetch this player's data from the API
    useEffect(() => {
        fetch(`http://phoenix.zapto.org:3005/get/player/${player}`)
        .then (res => res.json())
        .then (data => setPlayerData(data))
    }, [player])
    // TODO - set up a webhook to do this any time the data changes

    return (
        <div className="PlayerData">
            <table>
                <tr>
                    <td colspan={resources.length}>
                        <h1>{playerData.name}</h1>
                    </td>
                </tr>
                <tr>
                    { // Create a column for each resource
                    resources.map((resource) => {
                        return (
                            <td>
                                <ResourcePanel resource={resource} quantity={playerData.resources[resource]} />
                            </td>
                        )
                    })}
                </tr>
                <tr>
                    { // Show this player's claimed harbours
                    harbours.map((harbour) => {
                        return (
                            <td>
                                <HarbourPanel harbour={harbour} />
                            </td>
                        )
                    })}
                </tr>
            </table>
        </div>
    )
}

// Show information for an individual resource
function ResourcePanel(props) {
    return (
        <div className="ResourcePanel" >
            <img className="ResImg" src={process.env.PUBLIC_URL + `/img/resources/${props.resource}.png`} alt={props.resource} />
            <div className="Info">
                <h1>{props.quantity}</h1>
            </div>
        </div>
    )
}

// Display an image for a claimed harbour
function HarbourPanel(props) {
    return (
        <div className="HarbourPanel" >
            <img className="HarbourImg" src={process.env.PUBLIC_URL + `/img/harbour/${props.harbour}.png`} alt={props.harbour} />
        </div>
    )
}
