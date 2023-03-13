import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createComment } from '../store/actions/comments';
import { getComments } from '../store/actions/info';

class CommentModal extends Component {
    // Component state, different from redux/application state
    state =
        {
            modal: false,
            message: ''
        }
    
    staticPropTypes = 
    {
        isAuthenticated: PropTypes.bool,
        createComment: PropTypes.func.isRequired
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
        // Stops the form from submitting
        e.preventDefault();

        this.toggle();

        this.props.createComment(this.props.eventId, this.props.auth.user.id, this.state.message);
        setTimeout( () => {
            this.props.getComments();
        }, 200);

    }

    render() {
        return (
            <div>
                <Button style={{ margin: '1rem'}} onClick={this.toggle}>
                    Add Comment
                </Button>

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>New Comment</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="message"
                                    id="message"
                                    placeholder="message"
                                    onChange={this.onChange} />
                                <Button
                                    color="dark"
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Create Comment</Button>
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

export default connect(mapStateToProps, { createComment, getComments })(CommentModal);