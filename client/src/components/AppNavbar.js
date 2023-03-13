import React, { Component, Fragment } from 'react';
import {Collapse,Navbar,NavbarToggler,NavbarBrand, Nav,NavItem, Container} from 'reactstrap';
import RegisterModal from'./RegisterModal';
import RSOModal from './RSOModal';
import CreateRSO from'./CreateRSO';
import Logout from './Logout';
import LoginModal from './LoginModal';
import { connect } from 'react-redux';
import { getRSOEvents } from '../store/actions/events';
import { getComments } from '../store/actions/info';
import PropTypes from 'prop-types';
import CreateUniversity  from './CreateUniversity';

class AppNavbar extends Component 
{
    state = 
    {
        isOpen: false
    }

    static propTypes = 
    {
        auth: PropTypes.object.isRequired,
        getRSOEvents: PropTypes.func.isRequired,
        getComments: PropTypes.func.isRequired
    }

    componentDidMount ()
    {
        this.props.getComments();
    }

    toggle = () =>
    {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render()
    {
        const { isAuthenticated } = this.props.auth;


        const authLinks = (
            <Fragment>
                <NavItem>
                    <CreateUniversity />
                </NavItem>
                <NavItem>
                    <RSOModal />
                </NavItem>
                    <CreateRSO />
                <NavItem>
                    <Logout />
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <RegisterModal />
                </NavItem>
                <NavItem>
                    <LoginModal />
                </NavItem>
            </Fragment>
        );

        return(
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">COP 4710 College RSO Project</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                { isAuthenticated ? authLinks : guestLinks}
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
        
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    auth: state.auth
});

export default connect(mapStateToProps, { getRSOEvents, getComments })(AppNavbar);