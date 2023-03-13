import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, NavLink, Alert} from 'reactstrap';
import { clearErrors } from '../store/actions/errorActions'; 
import { createUniversity } from '../store/actions/info'; 
import { connect } from 'react-redux';

class CreateUniversity extends Component 
{
    // Component state, different from redux/application state
    state = 
    {
        modal: false,
        name: '',
        msg: null
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

    componentDidUpdate(prevProps) {
        const { error } = this.props;

        if (error !== prevProps.error)
            if (error.id === 'Error creating university')
                this.setState({ msg: error.msg });
            else if (error.id === null) {
                this.setState({ msg: null, modal:false});
            }
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (this.state.name !== '')
        {
            this.props.createUniversity(this.state.name);
        
            // this.toggle();
            // this.setState({name:''});
        }
        else
            this.setState({msg:'Please enter the name of the university'});
    }


    render()
    {
        const authLinks = (
            <div>
                <NavLink href="#"
                    color="light"
                    onClick={this.toggle}
                >Create University</NavLink>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Create New University</ModalHeader>
                    <ModalBody>
                    {this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    onChange={this.onChange} />
                                <Button
                                    color="primary"
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Create University</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );


        return (
            <div>
                {this.props.auth.user.auth_level === 2 ?
            authLinks : <Fragment/>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.error
});

export default connect(mapStateToProps, { createUniversity, clearErrors})(CreateUniversity);