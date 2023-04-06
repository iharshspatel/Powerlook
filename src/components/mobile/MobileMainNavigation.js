import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {Link, withRouter} from 'react-router-dom';
import {isAuth} from '../../utilities';
import LoginModal from '../user/LoginModal';
import MainNavigation from '../MainNavigation';

class MobileMainNavigation extends Component {

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

    showModal(){
        window.getFooter().setState({
            renderElement: <LoginModal redirectTo={this.props.history.push} redirectUrl="/account/myorders" onHide={this.hideModal.bind(this)} />
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
            <div className="app-nav nav--visible">
                <div className="sidebar-container">
                   <div className="naviLevel title">Shop for</div><button className="dismiss-mob-nav" onClick={this.props.callback}>&times;</button>
                   <MainNavigation callback={this.props.callback} mobile={true} customClassName="nav-ul" />
                   <div className="user-specific-links">
                      <ul>
                        {
                          auth
                          ?
                          <li>
                              <Link to="/account">My Account</Link>
                          </li>
                          :
                          <>
                            <li>
                              <a href="javascript:void(0);" onClick={this.signIn.bind(this)}>Login</a>
                            </li>
                            <li>
                              <a href="javascript:void(0);" onClick={this.signIn.bind(this)}>Sign up</a>
                            </li>
                          </>
                        }
                         <li>
                            {
                                isAuth()
                                ?
                                <Link to="/account/myorders">Track Order</Link>
                                :
                                <a href="javascript:void(0);" onClick={this.showModal.bind(this)}>
                                    Track Order
                                </a>
                            }
                            
                         </li>
                         <li>
                            <Link to="/stores">Store Locator</Link>
                         </li>
                         <li>
                            <Link to="/contactus">Contact Us</Link>
                         </li>
                         {
                          auth
                          ?
                          <li>
                            <Link to="/logout">Logout</Link>
                          </li>
                          :
                          ''
                         }
                      </ul>
                   </div>
                </div>
             </div>
        );
    }
}

const mapStatesToProps = (state) => {
    return {
        status: state.Auth.status,
        compName: state.Auth.compName,
    };
}

export default withRouter(connect(mapStatesToProps)(MobileMainNavigation));