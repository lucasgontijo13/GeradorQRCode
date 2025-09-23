// src/App.jsx

import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import './App.css'; // Opcional, para estilização global se quiser

function App() {
  return (
    <div className="App">
      <QRCodeGenerator />
    </div>
  );
}

export default App;