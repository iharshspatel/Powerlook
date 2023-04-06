import React, { Component } from 'react';
import {isMobile} from '../utilities';
import MobileHeader from './mobile/MobileHeader';
import WebHeader from './WebHeader';
import Topbar from './Topbar';

class Header extends Component {

    constructor(props){
        super(props);

        this.state = {
            mobile: isMobile(this.rerender.bind(this))
        };

        this._unMounted = false;
    }

    componentWillUnmount () {
        this._unMounted = true;
    }

    rerender(mobile){
        !this._unMounted && this.setState({
            mobile
        });
    }

    render() {
        const {mobile} = this.state;

        return (
          <>
            <Topbar />
            {
                mobile
                ?
                <MobileHeader />
                :
                <WebHeader />
            }
          </>
        );
    }
}

export default Header;
