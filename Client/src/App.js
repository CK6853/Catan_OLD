import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Basically just a shell routing to other pages based on URL

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Player from "./pages/Player";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>

          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/player/:player">
            <Player />
          </Route>

          <Route path="/admin">
            <Admin />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;