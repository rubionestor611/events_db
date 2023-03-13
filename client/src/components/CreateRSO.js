import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, NavLink, Alert } from 'reactstrap';
import { createRSO } from '../store/actions/rso';
import { connect } from 'react-redux';
import { clearErrors } from '../store/actions/errorActions';

class CreateRSO extends Component 
{
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
            if (error.id === 'Error creating RSO')
                this.setState({ msg: error.msg });
            else if (error.id === null)
                this.setState({ msg: null, modal:false });
    }

    onSubmit = (e) => {
        e.preventDefault();

        const { id, university_id } = this.props.auth.user;

        const RSO = {
            name: this.state.name,
            approved: 0,
            RSOs_admin_id: id,
            RSOs_university_id: university_id
        }

        this.props.createRSO(RSO);

    }

    render()
    {
        return (
            <div>
                <NavLink href="#"
                    color="light"
                    onClick={this.toggle}
                >Create RSO</NavLink>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Create New RSO</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>) : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    onChange={this.onChange}/>
                                <Button
                                    color="primary"
                                    style={{marginTop: '2rem'}}
                                    block
                                >Create RSO</Button>
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
    error: state.error

});

export default connect(mapStateToProps, { createRSO, clearErrors })(CreateRSO);