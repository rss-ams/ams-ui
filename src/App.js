import React from 'react';
import logo from './logo.svg';
import './App.css';
import ApplnBar from "./components/ApplnBar";
import SideMenu from "./components/SideMenu";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ApplnBar />
      <SideMenu />
    </div>
  );
}

export default App;
