import logo from './logo.svg';
import './App.css';
import {Login} from "./Login";
import {Register} from "./Register";
import {RegisterAdmin} from "./Register-Admin";
import React, {useState} from 'react';

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  
  return (
    <div className="App">
      {
        currentForm === 'login' ? <Login onFormSwitch={toggleForm}/> : (currentForm === 'register' ? <Register onFormSwitch={toggleForm}/> : <RegisterAdmin onFormSwitch={toggleForm}/>)
      }
    </div>
  );
}

export default App;
