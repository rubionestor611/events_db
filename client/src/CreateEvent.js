import React, {useState} from 'react';
import { useGlobalState } from './GlobalState';
import axios from 'axios';

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [EventDescription, setEventDescription] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check to see if Admin
    if(!globalState.user){
      alert("You don't have permission!");
      return;
    }

    if(eventName == ''){
      alert(' Provide a name for the Event you wish to create');
      return;
    }

    // axios call - handle storing a member of that rso name. if 4 of them then approve the rso and make this one admin
    axios.post('http://localhost:8800/events/create',
    {
      name: eventName,
      category: ,
      description: ,
      time: ,
      date: ,
      location_lat: ,
      location_long: ,
      location: ,
      phone: ,
      email: ,
      status: , 
      rating: ,
      approved: ,
      numRatings: ,
      scoreRatings: ,
      rso_id: ,
      admin_id: ,
      uni_id: globalState.user.uni_id,
      // Is this how to get admin_id?
      admin_id: globalState.user.id
    }).then((response)=>{
      console.log(response);
      alert(`${eventName} has been created!`);
    }).catch(err=>{
      console.log(err);
      if(err.response.status == 401){
        alert(`You are already a member of ${eventName}`);
      }else{
        alert(`Failed to create the Event named ${eventName}`)
      }
    })
  }

  return (
    <div className='create-event-form-container'>
      <h2>Create Event at {globalState.user.uni_name}</h2>
      <form className='create-event' onSubmit={handleSubmit}>
        <label htmlFor="EventName">Event Name</label>
        <input onChange={e=>setEventName(e.target.value)} value={eventName} type="text" placeholder="Name" id="eventName" name="eventName"/>

        <label htmlFor="EventCategory">Event Category</label>
        {/* needs to be radio or something */}
        {/* <input onChange={e=>setEventName(e.target.value)} value={eventName} type="text" placeholder="Event" id="eventName" name="eventName"/> */}

        <label htmlFor="EventDescription">Event Description</label>
        <input onChange={e=>setEventDescription(e.target.value)} value={EventDescription} type="text" placeholder="Description" id="eventDescription" name="eventDescription"/>

        {/* Time component, or just a global state to display in event page? */}
        <label htmlFor="EventTime">Event Time</label>
        <input onChange={e=>setEventName(e.target.value)} value={eventTime} type="text" placeholder="Ex: 1200PM" id="eventTime" name="eventTime"/>

        <label htmlFor="EventName">Event Name</label>
        <input onChange={e=>setEventName(e.target.value)} value={eventName} type="text" placeholder="Event" id="eventName" name="eventName"/>

        <label htmlFor="EventName">Event Name</label>
        <input onChange={e=>setEventName(e.target.value)} value={eventName} type="text" placeholder="Event" id="eventName" name="eventName"/>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};
  

// 
export default CreateEvent;