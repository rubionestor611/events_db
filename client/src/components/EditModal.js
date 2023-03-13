import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getComments } from '../store/actions/info';
import { editComment } from '../store/actions/comments';
import editIcon from '../icons/edit.png';

class EditModal extends Component {
    // Component state, different from redux/application state
    state =
        {
            modal: false,
            message: this.props.message
        }
    
    staticPropTypes = 
    {
        isAuthenticated: PropTypes.bool,
        editComment: PropTypes.func.isRequired,
        getComments: PropTypes.func.isRequired
    }


    toggle = () => {

        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }


    onSubmit = (e) => {
        e.preventDefault();

        this.props.editComment(this.state.message, this.props.idComment);
        
        setTimeout( () => {
            this.props.getComments();
        },200);
        

        this.toggle();

    }

    render() {
        return (
            <div style={{display:'inline'}}>
                <Button
                    className="remove-btn"
                    color="primary"
                    onClick={this.toggle}>
                <img src={editIcon} alt="Edit"/>
                </Button>

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit Comment</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="message"
                                    id="message"
                                    value= {this.state.message}
                                    onChange={this.onChange} />
                                <Button
                                    color="dark"
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Edit Comment</Button>
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
    auth: state.auth
});

export default connect(mapStateToProps, { editComment, getComments })(EditModal);