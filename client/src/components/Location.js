import React, { Component, Fragment } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearEvents, getPublicEvents, getRSOEvents } from '../store/actions/events';
import Events from './Events';
import EventModal from './EventModal';

class Location extends Component
{

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object.isRequired,
        universities: PropTypes.object.isRequired,
        getPublicEvents: PropTypes.func.isRequired,
        getRSOEvents: PropTypes.func.isRequired,
        clearEvents: PropTypes.func.isRequired,
    }

    constructor(props) 
    {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            current_university: "Choose Location",
            university_id: ""
        };
    }

    componentDidUpdate(prevProps)
    {
        if (this.props.user.isAuthenticated && !prevProps.user.isAuthenticated)
        {
            const { university_name, university_id, id } = this.props.user.user;
            

            if (university_name != null && this.state.current_university === "Choose Location")
            {   
                this.setState({
                    current_university: university_name,
                    current_university_id: university_id
                });

                this.props.getRSOEvents(id, university_id);
            }
            else 
            {
                this.props.clearEvents();

                // Wait for fade to finish
                setTimeout( () => {
                    this.props.getRSOEvents(id, this.state.current_university_id);
                }, 1000);
            }
        }
        if (!this.props.user.isAuthenticated && prevProps.user.isAuthenticated)
        {
            this.setState({
                current_university: "Choose Location"
            }); 
        }
    }

    
    toggle() 
    {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    onSelect = (e) => {
        const [id, name] = e.target.value.split(",");

        this.setState({
            current_university : name,
            current_university_id: id});

        this.props.clearEvents();

        if (this.state.current_university !== "Choose Location")
        {
            // Wait for fade to finish
            setTimeout( () => {
                if (!this.props.user.isAuthenticated)
                    this.props.getPublicEvents(this.state.current_university_id);
                else    
                    this.props.getRSOEvents(this.props.user.user.id, this.state.current_university_id);
            }, 1000);
        }       
        else if (this.state.current_university === "Choose Location")
        {
            if (!this.props.user.isAuthenticated)
                this.props.getPublicEvents(id);
               
            else    
                this.props.getRSOEvents(this.props.user.user.id, id);
        }
        
    }

    render() {

        const { universities } = this.props.universities;

        return(
            <div>
                {this.props.user.isAuthenticated ? <EventModal/> : <Fragment/>}
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}  style={{paddingBottom: '2rem'}}>
                    <DropdownToggle color="light" caret>{this.state.current_university}</DropdownToggle>
                    <DropdownMenu>
                    {universities.map(({ idUniversity, name}) => (
                        <DropdownItem key={name} value = {[idUniversity , name]} onClick={this.onSelect.bind(this)}>
                        {name}
                        </DropdownItem>
                    ))}
                    </DropdownMenu>
                </Dropdown>
                {this.state.current_university === "Choose Location" ? <Fragment/> : <Events/>}
            </div>
        );
    }
}



const mapStateToProps = state => ({
    user: state.auth,
    universities : state.info
});

export default connect(mapStateToProps, {clearEvents, getPublicEvents, getRSOEvents})(Location);