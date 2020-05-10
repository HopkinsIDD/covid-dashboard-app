import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'; 
import NavBar from './components/NavBar';
import MainContainer from './components/MainContainer';
import ScenariosInfo from './components/ScenariosInfo';
import Methods from './components/Methods';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <main>
          <NavBar />
          <Switch>
            <Route path="/" exact component={MainContainer} />
            <Route path="/scenarios" component={ScenariosInfo}/>
            <Route path="/methods" component={Methods}/>
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}


export default App;
