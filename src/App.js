import React from 'react';
import './App.css'; 
import NavBar from './components/NavBar';
import MainContainer from './components/MainContainer';

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
