import React from 'react';
import logo from './logo.svg';
import './App.css';
import FieldsPage from "./Pages/FieldsPage"
import ApplnBar from "./Pages/components/ApplnBar"
function App() {
  return (
    <div className="App">
      <ApplnBar />
      <FieldsPage />
    </div>
  );
}

export default App;
