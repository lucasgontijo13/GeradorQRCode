import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import Faq from './components/Faq'
import './App.css'; 

function App() {
  return (
    <div className="App">
      <QRCodeGenerator />
      <Faq />
    </div>
  );
}

export default App;