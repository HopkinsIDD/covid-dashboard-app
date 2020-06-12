import React from 'react';
import './App.css'; 
import MainContainer from './components/MainContainer';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
        <main>
          <NavBar />
          <MainContainer />
          <Footer />
        </main>
    </div>
  );
}

export default App;

