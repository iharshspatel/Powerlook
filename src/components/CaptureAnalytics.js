import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import {FBPIXELID, GAID, GTMID} from '../constants';

class CaptureAnalytics extends Component {

    constructor(props){
      super(props);

      this.unlisten = props.history.listen(this.captureView);
    }

    componentDidMount(){
        this.captureView();
    }

    componentWillUnmount(){
      this.unlisten();
    }

    captureView(){
      // Facebook Pixel
      if(typeof FBPIXELID !== 'undefined' && FBPIXELID){
        ReactPixel.init(FBPIXELID);
        ReactPixel.pageView();
      }

      // GA code
      if(typeof GAID !== 'undefined' && GAID){
        ReactGA.initialize(GAID);
        ReactGA.pageview(window.location.href);
      }

      // GTM code
      if(typeof GTMID !== 'undefined' && GTMID){
        const tagManagerArgs = {
            gtmId: GTMID
        };
         
        TagManager.initialize(tagManagerArgs);
      }
    }

    render() {
        return null;
    }
}

export default withRouter(CaptureAnalytics);
