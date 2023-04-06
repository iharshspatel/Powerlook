import React, { Component } from 'react';
import FooterBottomSection from './FooterBottomSection';
import CaptureAnalytics from './CaptureAnalytics';

class FooterCheckout extends Component {
  render() {
    return (
      <div className="site-footer">
        <FooterBottomSection />
        <CaptureAnalytics />
      </div>
    );
  }
}

export default FooterCheckout;
