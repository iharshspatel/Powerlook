import React, { Component } from 'react';
import {isMobile} from '../utilities';
import MobileHeaderCheckout from './mobile/MobileHeaderCheckout';
import WebHeaderCheckout from './WebHeaderCheckout';

class HeaderCheckout extends Component {

    constructor(props){
        super(props);

        this.state = {
            mobile: isMobile(this.rerender.bind(this))
        };
    }

    rerender(mobile){
        this.setState({
            mobile
        });
    }

    render() {
        const {mobile} = this.state;

        return (
          <>
            {
                mobile
                ?
                <MobileHeaderCheckout />
                :
                <WebHeaderCheckout />
            }
          </>
        );
    }
}

export default HeaderCheckout;
