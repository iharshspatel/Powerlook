import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { checkPincodeAvailability } from '../actions/products';
import '../check_delivery.css';

class CheckDeliveryResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
      availability: false,
      cod: false,
      processing: true,
      pincode: props.match.params.pincode
    };
  }

  componentWillMount() {
    const { pincode } = this.state;
    checkPincodeAvailability(pincode).then(response => {
      this.setState({
        processing: false,
        cod: response.data[0].COD.status,
        availability: response.data[0].shipping.status
      });
    });
  }

  render() {
    const { availability, cod, pincode, processing } = this.state;

    return (
      <div className="main-wrapper">
        <Header />
        <div className="check-availability-wrapper">
          {
            processing
              ?
              <div className="avail-inner-wrapper loading-block" style={{ position: 'relative' }}></div>
              :
              <div className="avail-inner-wrapper">
                {
                  availability
                    ?
                    <>
                      <div className="image-ui delivery-yes"><img src="/assets/images/delivering.svg" alt="" /></div>
                      <div className="content-ui">
                        <h4 className="availability-heading">Yay! We are delivering to {pincode}</h4>
                        {
                          cod
                            ?
                            <p className="availability-text">We are delivering both prepaid and COD orders to this Pincode.</p>
                            :
                            <p className="availability-text">We are delivering only prepaid orders at the moment.</p>
                        }
                        <Link to="/" className="btn btn-border">CONTINUE SHOPPING</Link>
                      </div>
                    </>
                    :
                    <>
                      <div className="image-ui delivery-yes"><img src="/assets/images/Not-delivering.svg" alt="" /></div>
                      <div className="content-ui">
                        <h4 className="availability-heading">We are not delivering to {pincode}</h4>
                        <p className="availability-text">Due to COVID-19, we are not servicing at the pincode this moment. We will soon start servicing, meanwhile you can browse through our items.</p>
                        <div className="diffrent-pincode-ui">
                          <Link to="/check-delivery-availability" className="pincode-btn">Try a different pincode</Link>
                        </div>
                        <Link to="/" className="btn btn-border">Continue Browsing</Link>
                      </div>
                    </>
                }
              </div>
          }

        </div>
        <Footer />
        {/* seoContent={meta_data} */}
      </div>
    );
  }
}

export default CheckDeliveryResult;
