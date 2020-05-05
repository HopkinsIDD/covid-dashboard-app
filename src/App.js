import React from 'react';
import './App.css';
import Search from './components/Search';
import NavBar from './components/NavBar';
import MainContainer from './components/MainContainer';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <NavBar />
      </div>
      <MainContainer />
    </div>
  );
}

export default App;
