import React, { Component } from 'react';
import NewsletterSignup from './NewsletterSignup';
import FeaturesBlock from './home/FeaturesBlock';
import FooterLinks from './FooterLinks';
import CaptureAnalytics from './CaptureAnalytics';

class Footer extends Component {
  render() {
    const { seoContent } = this.props;
    return (
      <>
        <FeaturesBlock />
        <NewsletterSignup />

        {
          seoContent
            ?
            <div id="category-seo-content" className="features-block" style={{ borderBottom: '1px solid #ECECEC', borderTop: 0 }}
              dangerouslySetInnerHTML={{ __html: seoContent.cms_block_data }}
            >
            </div>
            :
            null
        }
        <FooterLinks />
        <CaptureAnalytics />
      </>
    );
  }
}

export default Footer;
