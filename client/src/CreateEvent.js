import React, {useState} from 'react';
import { useGlobalState } from './GlobalState';
import axios from 'axios';

const CreateEvent = () => {
  // Should be () or ('')
  const [rsoName, setRSOName] = useState('');
  const [rsoEvent, setRSOEvent] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  const [eventLatitude, setEventLatitude] = useState('');
  const [eventLongitude, setEventLongitude] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const [eventPhone, setEventPhone] = useState('');
  const [eventEmail, setEventEmail] = useState('');

  // Not sure what eventStatus means
  const [eventStatus, setEventStatus] = useState('');
  
  // Not a string?
  const [eventRating, setEventRating] = useState();

  // eventApproved, numRatings, scoreRatings, or rso_id (prob not) go here?

  const [globalState, updateGlobalState] = useGlobalState();

  // toggles whether or not rso dropdown list should be shown
  function toggleRSOEvent (){
    setRSOEvent(!rsoEvent);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check to see if Admin
    if(!globalState.user){
      alert("You don't have permission!");
      return;
    }

    if(eventName == ''){
      alert('Please provide a name for the Event you wish to create!');
      return;
    }
    
    const isApproved = false;
    
    // If not an RSO Event, approval not needed
    if (rsoEvent == false)
    {
        isApproved = true;
    }
 
    // Need Approval Logic
    isApproved = true;

    axios.post('http://localhost:8800/events/create',
    {
      name: eventName,
      category: eventCategory,
      description: eventDescription,
      time: eventTime,
      date: eventDate,
      location_lat: eventLatitude,
      location_long: eventLongitude,
      location: eventLocation,
      phone: eventPhone,
      email: eventEmail,
      status: eventStatus, 
      rating: eventRating,
      approved: isApproved,
      numRatings: numRatings,
      scoreRatings: scoreRatings,
      rso_id: rso_id,
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
      }// else if not approved? 
      // else if email not approved?
      // else other issues?
      else{
        alert(`Failed to create the Event named ${eventName}`)
      }
    })
  }

  return (
    <div className='create-event-form-container'>
      <h2>Create Event at {globalState.user.uni_name}</h2>
      <form className='create-event' onSubmit={handleSubmit}>
        <label htmlFor="eventName">Event Name</label>
        <input onChange={e=>setEventName(e.target.value)} value={eventName} type="text" placeholder="Name" id="eventName" name="eventName"/>

        <label htmlFor="eventCategory">Event Category</label>
        <select>
            {/* Can be seen by everyone */}
            <option selected value="Public">Public Event</option>
            
            {/* Can be seen by students of host university */}
            <option value="Private">Private Event</option>
            
            {/* Can be seen by members of RSO */}
            <option value="RSO" onChange={toggleRSOEvent}>RSO Event</option>
        </select>
        
        {/* if value=RSO from above, Choose RSO */}
        {rsoEvent} ? {/* Show RSO dropdown list*/} : {/* else not rsoEvent*/}
       
        <label htmlFor="eventDescription">Event Description</label>
        <input onChange={e=>setEventDescription(e.target.value)} value={eventDescription} type="text" placeholder="Description" id="eventDescription" name="eventDescription"/>

        {/* Time component, or just a global state to display in event page? */}
        <label htmlFor="eventTime">Event Time</label>
        <input onChange={e=>setEventTime(e.target.value)} value={eventTime} type="text" placeholder="Ex: 1200PM" id="eventTime" name="eventTime"/>
        
        {/* Do you have a thought for how to do date? Component? */}
        <label htmlFor="eventDate">Event Date</label>
        <input onChange={e=>setEventDate(e.target.value)} value={eventDate} type="text" placeholder="December 02" id="eventDate" name="eventDate"/>

        <label htmlFor="eventLatitude">Event Latitude</label>
        <input onChange={e=>setEventLatitude(e.target.value)} value={eventLatitude} type="text" placeholder="Latitude" id="eventLatitude" name="eventLatitude"/>

        <label htmlFor="eventLongitude">Event Longitude</label>
        <input onChange={e=>setEventLongitude(e.target.value)} value={eventLongitude} type="text" placeholder="Longitude" id="eventLongitude" name="eventLongitude"/>

        <label htmlFor="eventLocation">Event Location</label>
        <input onChange={e=>setEventLocation(e.target.value)} value={eventLocation} type="text" placeholder="Location" id="eventLocation" name="eventLocation"/>

        <label htmlFor="eventPhone">Contact Phone Number</label>
        <input onChange={e=>setEventPhone(e.target.value)} value={eventPhone} type="text" placeholder="123-456-7890" id="eventPhone" name="eventPhone"/>
        
        <label htmlFor="eventEmail">Contact Email Address</label>
        <input onChange={e=>setEventEmail(e.target.value)} value={eventEmail} type="text" placeholder="JoinOurEvent1!@gmail.com" id="eventEmail" name="eventEmail"/>

        {/* Is status needed? */}
        <label htmlFor="eventStatus">Event Status</label>
        <input onChange={e=>setEventStatus(e.target.value)} value={eventStatus} type="text" placeholder="Status" id="eventStatus" name="eventStatus"/>

        <label htmlFor="eventRating">Event Rating</label>
        <input onChange={e=>setEventRating(e.target.value)} value={eventRating} type="number" placeholder="3.4" id="eventRating" name="eventRating"/>
        
        {/* Don't need approved right? */}
        {/* It'd go here */}
        {/* Not sure how numRatings, scoreRatings, or rso_id works */}
      
        <button type="submit">Create Event</button>

      </form>
    </div>
  );
};

export default CreateEvent;