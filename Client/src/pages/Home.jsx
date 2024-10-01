import { useState, useEffect } from "react";
import  { useHistory } from 'react-router-dom';

// Index page 
// Players create a new profile for themselves, or navigate to a previously created one
export default function Home() {

    // Set up state for input box and player list
    const [newPlayer, setNewPlayer] = useState("");
    const [players, setPlayers] = useState([]);

    // Set up navigation to individual player pages
    // If given a name (player pressed their name), navigate to that page
    // If creating a new player, navigate to that page and the API will create one
    const history = useHistory();
    const routeChange = (givenPlayer = "") => {
        let path;
        if (givenPlayer !== "") {
            path = `/player/${givenPlayer}`;
        } else {
            path = `/player/${newPlayer}`;
        }
        
        history.push(path);
    }

    // Fetch a list of players from the API
    useEffect(() => {
        let url = `http://phoenix.zapto.org:3005/get/players`;
        fetch(url)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res;
        })
        // Save to state
        .then(playerArray => setPlayers(playerArray))
    }, [])

    return (
        <div className="Home">
            <h1>Catan Resource Tracker</h1>
            {/*Existing players*/}
            <h3>Click your name:</h3>
            <table>
                {players.map((player) => (
                    <tr><td onClick = {() => {routeChange(player)}}>{player}</td></tr>
                ))}
            </table>
            
            {/*New player*/}
            <h3>Or enter it here:</h3>
            <table>
                <tr>
                    <td>
                        <input
                            type="text"
                            name="player"
                            id="player"
                            value={newPlayer}
                            onChange={event => setNewPlayer(event.target.value)}
                            onKeyUp={event => {if (event.key === 'Enter') {routeChange()}}}
                        />
                    </td>
                    <td>
                        <button
                            id="player-button"
                            type="button"
                            onClick={routeChange}
                        >
                            Enter
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    )
}