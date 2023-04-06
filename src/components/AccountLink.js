import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {Link} from 'react-router-dom';
import {isAuth} from '../utilities';
import LoginModal from './user/LoginModal';

class AccountLink extends Component {

    constructor(props){
        super(props);
        this.state = {
            status: props.status
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.compName == 'auth' && nextProps.status != this.state.status){
            this.setState({
                status: nextProps.status
            });
        }
    }

    signIn(){
        window.getFooter().setState({
            renderElement: <LoginModal onHide={this.hideModal.bind(this)} />
        });
    }

    hideModal(){
        window.getFooter().setState({
          renderElement: null
        });
    }

    render() {
        const auth = isAuth();
        return (
            <>
                {
                    auth
                    ?
                     <div className="after-login">
                        <div className="user-profile-link">
                            <a href="javascript:void(0)" className="account-link" data-toggle="dropdown" id="nav-dropdown">
                              <img src="/assets/images/user.svg" alt="" />
                              <span>{auth.name}</span>
                            </a>
                            <div className="dropdown-nav dropdown-menu" aria-labelledby="nav-dropdown">
                              <ul>
                                 <li>
                                    <Link to="/account">My Profile</Link>
                                 </li>
                                 <li>
                                    <Link to="/account/myorders">My Orders</Link>
                                 </li>
                                 <li>
                                    <Link to="/account/mywishlist">Wishlist</Link>
                                 </li>
                                 <li>
                                    <Link to="/logout">Logout</Link>
                                 </li>
                              </ul>
                            </div>  
                        </div>
                     </div>
                     :
                     <a className="sign-in-link" href="javascript:void(0);" onClick={this.signIn.bind(this)}><span>Login</span></a>
                }
            </>
        );
    }
}

const mapStatesToProps = (state) => {
    return {
        status: state.Auth.status,
        compName: state.Auth.compName,
    };
}

export default connect(mapStatesToProps)(AccountLink);
