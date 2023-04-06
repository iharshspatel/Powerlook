/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AccountLink from './AccountLink';

class TopNavigation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul>
                <li>                    
                    <a href="https://careers.powerlook.in/" target="_blank">Careers</a>
                </li>                
                <li>
                    <NavLink activeClassName="active" to="/account/myorders">Track Order</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/stores">Store Locator</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/contactus">Contact Us</NavLink>
                </li>
                <li>
                    <AccountLink />
                </li>
            </ul>
        );
    }
}

export default TopNavigation;
