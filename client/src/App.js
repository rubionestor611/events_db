import logo from './logo.svg';
import './App.css';
import {Login} from "./Login";
import {Register} from "./Register";
import {RegisterAdmin} from "./Register-Admin";
import React, {useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthentiationPage from './AuthenticationPage';
import CreateRSO from './CreateRSO';
import CreateUni from './CreateUni';
import JoinRSO from './JoinRSO';
import ViewEvent from './ViewEvent';
import LandingPage from './LandingPage';
import CreateEvent from './CreateEvent';
import SuperAdminEvents from './SuperAdminEvents';

function App() {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthentiationPage/>} />
          <Route path="/login" element={<AuthentiationPage/>} />
          <Route path="/landing" element={<LandingPage/>} />
          <Route path="/createrso" element={<CreateRSO/>} />
          <Route path="/joinrso" element={<JoinRSO/>} />
          <Route path="/createuni" element={<CreateUni/>} />
          <Route path="/viewevent" element={<ViewEvent/>} />
          <Route path="/createevent" element={<CreateEvent/>} />
          <Route path="/superadminevents" element={<SuperAdminEvents/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
