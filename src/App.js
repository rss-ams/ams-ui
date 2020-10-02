import React from 'react';
import logo from './logo.svg';
import './App.css';
import FieldsPage from "./Pages/FieldsPage"
import ApplnBar from "./Pages/components/ApplnBar"
import MapsPage from "./Pages/MapsPage"
import ActivityPage from "./Pages/ActivityPage"
function App() {
  return (
    <div className="App">
      <ApplnBar />
      {/* <FieldsPage /> */}
      {/* <MapsPage /> */}

      <ActivityPage />
    </div>
  );
}

export default App;
