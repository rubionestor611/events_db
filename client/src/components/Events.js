import React, { Component, Fragment } from 'react';
import { Accordion, Card, Container } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { clearEvents, getRSOEvents, updateRating} from '../store/actions/events'
import Comments from './Comments';
import Approval from './Approval';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';

class Events extends Component
{

    constructor(props) 
    {
        super(props);

        this.state = {
            university: ''
        };
    }

    //, idEvent, rating, numRatings, scoreRatings 
    changeRating = (newRating, name) => {
        let value = (name[3] + newRating)/(name[2] + 1);

        this.props.updateRating(name[0], value, name[2]+1, name[3] + newRating );

        this.props.getRSOEvents(this.props.auth.user.id, this.props.auth.user.university_id);
    }

    renderApproval () {
        if(this.props.auth.isAuthenticated)
            if(this.props.auth.user.auth_level === 2)
                return (
                    <Approval/>
                );
            else
                return(<Fragment/>);
    }

    render() {

        const { isAuthenticated } = this.props.auth;

        return(
            <Container>
                <Accordion style={{display: 'flex', justifyContent: 'center'}}>
                    <TransitionGroup className="events-list" style={{opacity: .85}}>
                    {this.props.events.map(({ idEvent, eventName, category, description,
                        name, time, date, location, phone, email, rating, numRatings, scoreRatings, Events_university_id }) => (
                        <CSSTransition key={idEvent} timeout={1000} classNames="fade">
                            <Card>
                                <Accordion.Toggle style={{paddingLeft:'4rem' , paddingRight:'4rem'}} as={Card.Header} eventKey={idEvent}>
                                    {name}{" | "}{eventName}{" | "}{time}{" | "}{date}
                                </Accordion.Toggle>
                                    
                                <Accordion.Collapse eventKey={idEvent}>
                                    <Card.Body>
                                        <Card.Title>{eventName}</Card.Title>
                                        <Card.Subtitle>{description}</Card.Subtitle>
                                        <Card.Subtitle>{category}</Card.Subtitle>
                                        <Card.Subtitle>{location}</Card.Subtitle>
                                        <Card.Subtitle>{phone}</Card.Subtitle>
                                        <Card.Subtitle>{email}</Card.Subtitle>
                                            <StarRatings name={[idEvent, rating, numRatings, scoreRatings]} rating={rating} changeRating={isAuthenticated ? this.changeRating : null}/>
                                        <Comments eventId={idEvent}/>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </CSSTransition>
                    ))}
                    </TransitionGroup>
                </Accordion>

                {this.renderApproval()}
            </Container>
        );
    }
}

Events.propTypes = 
{   
    clearEvents: PropTypes.func.isRequired,
    events: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    events: state.events.events,
    auth: state.auth,
});

// first param = mapping, 2nd = actions, 3rd = component we are connecting to state
export default connect(mapStateToProps, {clearEvents, updateRating, getRSOEvents})(Events);