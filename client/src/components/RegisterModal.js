import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, NavLink, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../store/actions/auth';
import { clearErrors } from '../store/actions/errorActions';
import { getPrivateEvents, clearEvents } from '../store/actions/events';

class RegisterModal extends Component {
    // Component state, different from redux/application state
    state =
        {
            modal: false,
            userName: '',
            password: '',
            auth_level: 0,
            university_id: '',
            university_name: '',
            msg: null
        }
    
    staticPropTypes = 
    {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        universities: PropTypes.array.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) 
    {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) 
            if (error.id === 'REGISTER_FAIL')
                this.setState({msg: error.msg.msg});
            else
                this.setState({ msg: null});

        // Closes the modal if the registration is successful
        if (this.state.modal)
            if (isAuthenticated)
            {
                this.props.clearEvents();

                // Wait for fade to finish
                setTimeout( () => {
                    this.props.getPrivateEvents(this.state.auth.user.Users.university_id);
                }, 1000);
                this.toggle();
            }
    }

    toggle = () => {
        this.props.clearErrors();

        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSelect = (e) => {
        const [id, name] = e.target.value.split(',');
        this.setState({
            university_id: parseInt(id),
            university_name: name
        });
    }

    onSubmit = (e) => {
        // Stops the form from submitting
        e.preventDefault();

        const { userName, password, auth_level, university_id, university_name } = this.state;

        if (!Number.isInteger(this.state.university_id))
        {
            const newUser = {
                userName,
                password,
                auth_level,
                university_id: this.props.universities.universities[0].idUniversity,
                university_name: this.props.universities.universities[0].name
            }

            // Add contact via addContact action
            this.props.register(newUser);
        }

        else
        {

            const newUser = {
                userName,
                password,
                auth_level,
                university_id,
                university_name
            }

            // Add contact via addContact action
            this.props.register(newUser);
        }

    }

    render() {
        return (
            <div>
                <NavLink onClick={this.toggle} href="#">
                    Register
                </NavLink>

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>New User</ModalHeader>
                    <ModalBody>
                        { this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null} 
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="userName"
                                    id="userName"
                                    placeholder="Username"
                                    onChange={this.onChange} />
                                <Input
                                    type="text"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    onChange={this.onChange} />
                                <Input type="select" name="auth_level" id="auth_level" onChange={this.onChange}>
                                    <option name="auth_level" value = "0">Student</option>
                                    <option name="auth_level" value = "1">Admin</option>
                                    <option name="auth_level" value = "2">SuperAdmin</option>
                                </Input>
                                <Input type="select" name="university" id="university" onChange={this.onSelect}>
                                {this.props.universities.universities.map(({ idUniversity, name}) => (
                                    <option 
                                        key ={idUniversity} 
                                        value = {[idUniversity , name]}
                                        >
                                    {name}
                                    </option>
                                ))}
                                </Input>
                                <Button
                                    color="dark"
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Register</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    universities : state.info,
    error: state.error
});

export default connect(mapStateToProps, { register, clearErrors, clearEvents, getPrivateEvents })(RegisterModal);