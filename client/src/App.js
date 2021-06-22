import React from 'react';
import Home from './components/Home';
import './css/App.css';
import Download from './components/Download';
import {Switch, Route} from "react-router-dom";

function App() {
  return (<>
        <Switch>
            <Route exact path='/'>
                <Home/>
            </Route>

            <Route exact path='/download/:id'>
                <Download/>
            </Route>
        </Switch>
    </>
  );
}

export default App;