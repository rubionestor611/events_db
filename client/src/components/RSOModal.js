import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, NavLink} from 'reactstrap';
import { connect } from 'react-redux';
import { getRSOs, clearRSOs } from '../store/actions/info';
import { getRSOEvents } from '../store/actions/events';
import { joinRSO } from '../store/actions/rso';

class RSOModal extends Component 
{
    // Component state, different from redux/application state
    state = 
    {
        modal: false,
        rso: ''
    }

    componentDidMount()
    {

        this.props.getRSOs(this.props.auth.user.id, this.props.auth.user.university_id);
    }

    componentDidUpdate(prevProps)
    {
       
        if (this.props.rsos.length !== prevProps.rsos.length )
        {
            this.setState({
                rso: this.props.rsos[0].idRSO
            });
        }
            
    }

    toggle = () => 
    {
        this.setState({
            modal: !this.state.modal,
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
        // Stops the form from submitting
        e.preventDefault();

        const { id, university_id } = this.props.auth.user;


        const RSO = {
            id: id,
            rso_id: this.state.rso,
        }

        this.props.joinRSO(RSO);

        // Wait for fade to finish
        setTimeout(() => {
            this.props.getRSOEvents(id, university_id);
            this.props.clearRSOs();
            this.props.getRSOs(id, university_id);
        }, 600);

        // Close modal
        this.toggle();

        this.setState({
            modal: false,
            rso_id: ''
        });
    }

    render()
    {
        return (
            <div>
                <NavLink
                    color="dark"
                    onClick={this.toggle}
                    href="#"
                >Join RSOs</NavLink>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Join RSOs</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label>Choose an RSO to join:</Label>
                                <Input type="select" name="rso" id="rso" onChange={this.onChange}>
                                    {this.props.rsos.map(({ name, idRSO }) => (
                                    <option 
                                        key ={name} 
                                        value = {idRSO}>
                                    {name}
                                    </option>
                                ))}
                                </Input>
                                <Button
                                    color="success"
                                    style={{marginTop: '2rem'}}
                                    block
                                >Join RSO</Button>
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
    rsos: state.info.rsos
});

export default connect(mapStateToProps, { getRSOs, clearRSOs, getRSOEvents, joinRSO})(RSOModal);