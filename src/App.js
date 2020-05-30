import React from 'react';
import './App.css'; 
import MainContainer from './components/MainContainer';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App">
        <main>
          <NavBar />
          <MainContainer />
        </main>
    </div>
  );
}

export default App;

