import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

class CustomerAccountLeftNavigation extends Component {

   constructor(props){
      super(props);
   }

    render() {
        const {toggleLeftNav} = this.props;
        return (
            <ul className="nav">
              <li className="nav-item">
                <NavLink onClick={toggleLeftNav} exact className="nav-link" activeClassName="active" to="/account">Profile</NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={toggleLeftNav} className="nav-link" activeClassName="active" to="/account/returns">Returns / Exchange</NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={toggleLeftNav} className="nav-link" activeClassName="active" to="/account/myorders">My Orders</NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={toggleLeftNav} className="nav-link" activeClassName="active" to="/account/mywishlist">My Wishlist</NavLink>
              </li>
              {/*<li className="nav-item">
                              <NavLink onClick={toggleLeftNav} className="nav-link" activeClassName="active" to="/account/savedcards">Saved Cards</NavLink>
                            </li>*/}
              <li className="nav-item">
                <NavLink onClick={toggleLeftNav} className="nav-link" activeClassName="active" to="/account/myaddresses">Addresses</NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={toggleLeftNav} className="nav-link" activeClassName="active" to="/account/mywallet">Powerlook Wallet</NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={toggleLeftNav} className="nav-link" activeClassName="active" to="/account/changepassword">Change Password</NavLink>
              </li>
            </ul>
        );
    }
}

export default CustomerAccountLeftNavigation
