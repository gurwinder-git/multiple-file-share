import React from 'react';
import Upload from './components/Upload';
import Download from './components/Download';
import './css/App.css';
import {Switch, Route} from "react-router-dom";

function App() {
  return (<>
        <Switch>
            <Route exact path='/'>
                <Upload/>
            </Route>

            <Route exact path='/download/:id'>
                <Download/>
            </Route>
        </Switch>
    </>
  );
}

export default App;