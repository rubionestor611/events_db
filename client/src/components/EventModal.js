import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, Alert} from 'reactstrap';
import { connect } from 'react-redux';
import { getRSOsAdmin } from '../store/actions/info';
import { createEvent, checkTime } from '../store/actions/events';
import { clearErrors } from '../store/actions/errorActions';

class EventModal extends Component 
{
    // Component state, different from redux/application state
    state = 
    {
        modal: false,
        name: '',
        eventName: '',
        category: 'Meeting',
        description: '',
        time: '',
        time_period: 'pm',
        date: '',
        location: '',
        phone: '',
        email: '',
        status: 'rso',
        university: '',
        rso: 533,
        admin_id: '',
        approved: '',
        msg: null
    }

    componentDidMount()
    {
        this.props.getRSOsAdmin(this.props.auth.user.id);
    }

    toggle = () => 
    {
        this.setState({
            modal: !this.state.modal,
            rso: this.props.rsos[0].idRSO,
            eventName: this.props.rsos[0].name,
            msg: null
        });

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        
    }

    onSelect = (e) => {
        const [name, id] = e.target.value.split(",");

        this.setState({
            rso: id, 
            eventName:name
        });
    }


    onSubmit = (e) => {
        e.preventDefault();
        this.setState({msg:null});
        const { id, university_id } = this.props.auth.user;


        this.props.checkTime(university_id, this.state.location, this.state.date, this.state.time + "" + this.state.time_period);

        setTimeout( () => {

            if (this.props.events.timeCheck === 0)
            {
                let app = 1;
                let status = this.state.status;
                if (this.state.rso === 553)
                {
                    app = 0;
                    status = "Public";
                }
    
                const event = {
                    name: this.state.name,
                    eventName: this.state.eventName,
                    category: this.state.category,
                    description: this.state.description,
                    time: this.state.time + this.state.time_period,
                    date: this.state.date,
                    location: this.state.location,
                    phone: this.state.phone,
                    email: this.state.email,
                    status: status,
                    Events_university_id: university_id,
                    Events_RSO_id: this.state.rso,
                    Events_admin_id: id,
                    approved: app
                }
                this.props.createEvent(event);
    
                // Close modal
                this.toggle();
    
                this.setState({
                    modal: false,
                    name: '',
                    eventName:'',
                    category: 'Meeting',
                    description: '',
                    time: '',
                    time_period: 'pm',
                    date: '',
                    location: '',
                    phone: '',
                    email: '',
                    status: 'rso',
                    university: '',
                    rso: this.props.rsos[0].idRSO,
                    admin_id: '',
                    approved: 0
                });
            }
            
            else
            {
                this.setState({msg:"This event time is already taken, please choose a different time of day"});
            }
        }, 500);
        
       
    }

    render()
    {
        return (
            <div>
                <Button
                    color="light"
                    style={{ marginBottom: '2rem' }}
                    onClick={this.toggle}
                >Create Event</Button>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>New Event</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label>Choose RSO to make the event for:</Label>
                                <Input type="select" name="rso" id="rso" onChange={this.onSelect}>
                                    {this.props.rsos.map(({ name, idRSO, approved }) => (
                                    <option 
                                        disabled = {(approved === 0 ? (idRSO !== 553 ? true: false) : false)}
                                        key ={name} 
                                        value = {[name, idRSO]}>
                                    {name} {approved ? "" : " (Unapproved)"}
                                    </option>
                                ))}
                                </Input>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Event name"
                                    onChange={this.onChange}/>
                                <Input type="select" name="category" id="category" onChange={this.onChange}>
                                    <option value = "Meeting">Meeting</option>
                                    <option value = "Social">Social</option>
                                    <option value = "Fundraising">Fundraising</option>
                                    <option value = "Tech Talks">Tech Talks</option>
                                    <option value = "Guest Speaker">Guest Speaker</option>
                                </Input>
                                <Input
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Description"
                                    onChange={this.onChange}/>
                                <Input
                                    type="text"
                                    name="time"
                                    id="time"
                                    placeholder="Time"
                                    onChange={this.onChange}/>
                                <Input type="select" name="time_period" id="time_period" onChange={this.onChange}>
                                    <option value="pm">PM</option>
                                    <option value="am">AM</option>
                                </Input>
                                <Input
                                    type="text"
                                    name="date"
                                    id="date"
                                    placeholder="Date"
                                    onChange={this.onChange}/>
                                <Input
                                    type="text"
                                    name="location"
                                    id="location"
                                    placeholder="Location"
                                    onChange={this.onChange}/>
                                <Input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="Phone"
                                    onChange={this.onChange}/>
                                <Input
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    onChange={this.onChange}/>
                                <Input type="select" name="status" id="status" onChange={this.onChange}>
                                    <option value = "rso">Club Members only</option>
                                    <option value = "private">College Wide Event</option>
                                    <option value = "public">Public Event</option>
                                </Input>
                                <Button
                                    color="primary"
                                    style={{marginTop: '2rem'}}
                                    block
                                >Create Event</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    rsos: state.info.rsosAdmin,
    events: state.events
});

export default connect(mapStateToProps, { getRSOsAdmin, createEvent, clearErrors, checkTime })(EventModal);