import React, { createContext, useState } from 'react';
import Upload from './components/Upload';
import Download from './components/Download';
import './css/App.css';
import './css/mobile.css';
import { Switch, Route } from "react-router-dom";

let responseContext = createContext()

function App() {
    let [response, setResponse] = useState({})
    return (<>
        <responseContext.Provider value={{ response, setResponse }}>
            <Switch>
                <Route exact path='/'>
                    <Upload />
                </Route>

                <Route exact path='/download/:id'>
                    <Download />
                </Route>
            </Switch>
        </responseContext.Provider>
    </>
    );
}

export { responseContext };
export default App;