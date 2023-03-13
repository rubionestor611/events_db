import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { Accordion, Card } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUnapprovedEvents, approveEvent, denyEvent, getRSOEvents } from '../store/actions/events';

class Approval extends Component {
    
    staticPropTypes = 
    {
        getUnapprovedEvents: PropTypes.func.isRequired,
        approveEvent: PropTypes.func.isRequired
    }

    componentDidMount()
    {
        this.props.getUnapprovedEvents(this.props.auth.user.university_id);
    }


    onClickApprove = (idEvent) => {
        this.props.approveEvent(idEvent);
        setTimeout( () =>{
            this.props.getRSOEvents(this.props.auth.user.idUser, this.props.auth.user.university_id);
        }, 200);

    }

    onClickDeny = (idEvent) => {
        this.props.denyEvent(idEvent);
        setTimeout( () =>{
            this.props.getRSOEvents(this.props.auth.user.idUser, this.props.auth.user.university_id);
        }, 200);
    }

    render() {
        return(
            <div>
                <Accordion style={{display: 'flex', justifyContent: 'center', marginTop: '4rem'}}>
                    <TransitionGroup className="events-list" style={{opacity: .85}}>
                    {this.props.unApprovedEvents.map(({ idEvent, eventName, category, description,
                        name, time, date, location, phone, email }) => (
                        <CSSTransition key={idEvent} timeout={1000} classNames="fade">
                            <Card>
                                <Accordion.Toggle style={{paddingLeft:'4rem' , paddingRight:'4rem'}} as={Card.Header} eventKey={idEvent}>
                                    {"(Requires Approval | "}
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
                                        <Button
                                            color="primary"
                                            style={{ marginBottom: '2rem' }}
                                            onClick={this.onClickApprove.bind(this, idEvent)}
                                        >Approve Event</Button>
                                        <Button
                                            color="danger"
                                            style={{ marginBottom: '2rem' }}
                                            onClick={this.onClickDeny.bind(this, idEvent)}
                                        >Deny Event</Button>
                                        
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </CSSTransition>
                    ))}
                    </TransitionGroup>
                </Accordion>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    unApprovedEvents: state.events.unApprovedEvents
});

export default connect(mapStateToProps, { getUnapprovedEvents, approveEvent, denyEvent, getRSOEvents })(Approval);