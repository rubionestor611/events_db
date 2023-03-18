import './App.css';
import React, {useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthentiationPage from './AuthenticationPage';
import CreateRSO from './CreateRSO';
import JoinRSO from './JoinRSO';
import LandingPage from './LandingPage';
import CreateEvent from './CreateEvent';
import SuperAdminEvents from './SuperAdminEvents';
import CreateUni from './CreateUni';
import ManageUnis from './ManageUnis';
import ManageEvents from './ManageEvents';

function App() {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          {/* Login routes */}
          <Route path="/" element={<AuthentiationPage/>} />
          <Route path="/login" element={<AuthentiationPage/>} />
          {/* Super Admin Stuff*/}
          <Route path="/superadmin/createuniversity" element={<CreateUni/>}/>
          <Route path="/superadmin/manageuniversities" element={<ManageUnis/>}/>
          <Route path="/superadmin/events" element={<SuperAdminEvents/>} />
          {/* Admin Stuff */}
          <Route path="/admin/createevent" element={<CreateEvent/>} />
          <Route path="/admin/manageevents" element={<ManageEvents/>} />
          {/* User Stuff */}
          <Route path="/landing" element={<LandingPage/>} />
          <Route path="/joinrso" element={<JoinRSO/>} />
          <Route path="/createrso" element={<CreateRSO/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
