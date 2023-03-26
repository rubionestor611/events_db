import React, {useState, useEffect} from 'react';
import { useGlobalState } from "./GlobalState.js";
import axios from 'axios'
const CreateEvent = () => {
  const [RSO,setRSO] = useState(-1);
  const [visibility, setVisibility] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [AMPM, setAMPM] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [globalState, updateGlobalState] = useGlobalState();
  const [adminRSOs, setAdminRSOs] = useState([]);

  function isGoodDate(dt){
    if(dt == ""){
      return false;
    }
    var reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
    return reGoodDate.test(dt);
  }

  function isGoodTime(t){
    var regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(t);
  }

  useEffect(() => {
    async function getRSOs() {
      const res = await axios.get(`http://localhost:8800/rsos/${globalState.user.id}/admin`)
      const rsoList = await res.data.rsos;
      setAdminRSOs(rsoList);
    }
    getRSOs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!globalState.user || globalState.user.auth_level != 2){
      alert("You don't have permission!");
      return;
    }

    
    if(RSO < 0){
      alert("Please select an RSO for the event to be associated with.");
      return;
    }
    if(visibility == ""){
      alert("Please select a visibility for the event. You cannot schedule until you select one.")
      return;
    }
    if(title == ""){
      alert("Please enter a title. You cannot schedule an unnamed event.");
      return;
    }
    if(description == ""){
      alert("All events require a description. Users should know what kind of event this will be.");
      return;
    }
    if(type == ""){
      alert("Users should know what kind of event this is. Please provide a type.");
      return;
    }
    if(!isGoodDate(date)){
      alert("Please enter a good date so that potential attendees can schedule for it.");
      return;
    }
    if(!isGoodTime(time)){
      alert("Please enter a good time so that potential attendees can schedule for it.");
      return;
    }
    if(AMPM == ""){
      alert("Please enter whether the event is in the AM or PM.");
      return;
    }
    if(location == ""){
      alert("Please enter a location. All events need a way to attend.");
      return;
    }
    if(email == ""){
      alert('Please enter a contact email. All events need a contact.')
      return;
    }
    if(phone == ""){
      alert('Please enter a contact phone number. All events need a contact.');
      return;
    }

    console.log('rso', RSO)
    console.log('visibility', visibility)
    console.log('title', title)
    console.log('description', description)
    console.log('type', type)
    console.log('date', date)
    console.log('time', time)
    console.log('AMPM', AMPM)
    console.log('location', location)
    console.log('email/phone', email, phone)

    const subTime = `${time}${AMPM}`

    let isApproved = true;
    let status = "";
    if(visibility == 'ALL'){
      isApproved = false;
      status = "public"
    }else if(visibility == "RSO"){
      status = "rso";
    }else{
      status = "private";
    }

    axios.post("http://localhost:8800/events/create", 
    {
      name: title,
      category: type,
      description: description,
      time: subTime,
      date: date,
      location: location,
      phone: phone,
      email: email,
      eventStatus: status,
      uni_id: globalState.user.uni_id,
      rso_id: RSO,
      admin_id: globalState.user.id, 
      approved: isApproved
    })
    .then((res)=>{
        alert(`${title} created!`);
        setRSO(-1);
        setVisibility('');
        setTitle('');
        setDescription('');
        setType('');
        setDate('');
        setTime('');
        setAMPM('');
        setLocation('');
        setEmail('');
        setPhone('');
    }).catch(err => {
      alert("Something went wrong creating this event");
    })
  }

  return (
    <div className='create-uni-form-container'>
      <h2>Create Event</h2>
      <form className='create-event' onSubmit={handleSubmit}>
        <label htmlFor="RSO">Event's RSO</label>
        <select style={{marginBottom: '1rem'}} onChange={(e)=>{
          setRSO(e.target.value);
          }} name="selectedRSO">
          <option value={-1}>Select an RSO</option>
          {
          adminRSOs.map(rso => <option key={rso.id} value={rso.id}>{rso.name}</option>)
          }
        </select>
        <label htmlFor="visibility">Who can view this event?</label>
        <select style={{marginBottom: '1rem'}} onChange={(e)=>{
          setVisibility(e.target.value);
          }} name="selectedVisibility">
          <option value="" >Select an option</option>
          <option value="UNI">All {globalState.user.uni_name} students</option>
          <option value="RSO">RSO members only</option>
          <option value="ALL">All users</option>
        </select>
        <label htmlFor="Event Title">Event Title</label>
        <input onChange={e=>setTitle(e.target.value)} value={title} type="text" placeholder="Event Title" id="Event Title" name="Event Title"/>
        <label htmlFor="Description">Description</label>
        <input onChange={e=>setDescription(e.target.value)} value={description} type="text" placeholder="Event Description" id="Event Description" name="Event Description"/>
        <label htmlFor="Event Type">Event Type</label>
        <input onChange={e=>setType(e.target.value)} value={type} type="text" placeholder="Meeting, Party, etc." id="Event Type" name="Event Type"/>
        <label htmlFor="Event Date">Event Date</label>
        <input onChange={e=>setDate(e.target.value)} value={date} type="text" placeholder="MM/DD/YYYY" id="Event Date" name="Event Date"/>
        <label htmlFor="Event Time">Event Time</label>
        <input onChange={e=>setTime(e.target.value)} value={time} type="text" placeholder="HH:MM" id="Event Time" name="Event Time"/>
        <label htmlFor="Event AM/PM">Event AM/PM</label>
        <select style={{marginBottom: '1rem'}} onChange={(e)=>{
          setAMPM(e.target.value);
          }} name="selectedAMPM">
          <option value="" >Select AM or PM</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <label htmlFor="Event Location">Event Location</label>
        <input onChange={e=>setLocation(e.target.value)} value={location} type="text" placeholder="address" id="Event Location" name="Event Location"/>
        <label htmlFor="Contact Phone">Contact Phone</label>
        <input onChange={e=>setPhone(e.target.value)} value={phone} type="text" placeholder="phone # (ie 1234567890)" id="Contact phone" name="Contact phone"/>
        <label htmlFor="Contact Email">Contact Email</label>
        <input onChange={e=>setEmail(e.target.value)} value={email} type="text" placeholder="email" id="Contact Email" name="Contact Email"/>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};
  
export default CreateEvent;