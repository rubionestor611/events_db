import React, { Component, Fragment } from 'react';
import 
{ 
    Container,
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Card } from 'react-bootstrap';
import { getComments } from '../store/actions/info';
import { deleteComment } from '../store/actions/comments';
import { connect } from 'react-redux';
import CommentModal from './CommentModal'
import PropTypes from 'prop-types';
import deleteIcon from '../icons/delete.png';
import EditModal from './EditModal';


class Comments extends Component
{
    state = {
        comments: []
    }

    componentDidMount()
    {
        this.setState({
            comments: this.props.comments.filter(comment => comment.Comments_event_id === this.props.eventId)
        });
    }

    onDeleteClick = (idComment) => {
        this.props.deleteComment(idComment);
        setTimeout( () => {
            this.props.getComments();
        }, 200);

    }

    componentDidUpdate(prevProps)
    {
        if (this.props.comments.length !== prevProps.comments.length)
        {
            setTimeout( () => {
                this.setState({
                    comments: this.props.comments.filter(comment => comment.Comments_event_id === this.props.eventId)
                });
            }, 400);
        }
    }

    isAuthed = (username, idComment, message) => {
        if (this.props.auth.isAuthenticated)
        {
            if(username === this.props.auth.user.username)
            {
                return (
                    <div style={{marginTop:'1rem'}}>
                        <EditModal message={message} idComment={idComment}/>
                        <Button
                            className="remove-btn"
                            color="danger"
                            onClick={this.onDeleteClick.bind(this, idComment)}>
                        <img src={deleteIcon} alt="Delete"/>
                        </Button>
                    </div>
                );
            }
            else 
                return (
                    <Fragment/>
                );
        }
        else    
            return (
                <Fragment/>
            );
    }

    render() {

        return(
            <Container>
                {this.props.auth.isAuthenticated ? <CommentModal eventId={this.props.eventId}/>
                : <Fragment/>}
                <ListGroup>
                <TransitionGroup className="events-list">
                {this.state.comments.map(({ idComment, username, message }) => (
                <CSSTransition key={idComment} timeout={1000} classNames="fade" >
                    <ListGroupItem>
                        <Card>
                            <Card.Title style={{marginTop:'1rem'}}>{username}</Card.Title>
                            <Card.Subtitle>{message}
                                {this.isAuthed(username, idComment, message)}
                            </Card.Subtitle>
                        </Card>
                    </ListGroupItem>
                </CSSTransition>
                ))}
                </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

Comments.propTypes = 
{   
    deleteComment: PropTypes.func.isRequired,
    getComments: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    comments: state.info.comments
});

export default connect(mapStateToProps, { getComments, deleteComment })(Comments);