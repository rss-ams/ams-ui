import React from 'react';
import logo from './logo.svg';
import './App.css';
import ApplnBar from "./components/ApplnBar";
import SideMenu from "./components/SideMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <ApplnBar />
      <SideMenu />
    </div>
  );
}

export default App;
