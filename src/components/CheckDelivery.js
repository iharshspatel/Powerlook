import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../check_delivery.css';

class CheckDelivery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      pincode: ''
    };
  }

  handleChange(e) {
    const { value } = e.target;
    let disabled = true;
    if (value.replace(/\s{1,}/, '').length == 6 && !isNaN(value)) {
      disabled = false;
    }
    this.setState({
      pincode: value,
      disabled
    });
  }

  checkAvailability(e) {
    e.preventDefault();
    const { disabled, pincode } = this.state;
    if (!disabled) {
      this.props.history.push(`check-delivery-availability/${pincode}`);
    }

    return false;
  }

  componentDidMount() {
    window.$$('#pincode-field').focus();
  }

  render() {
    const { disabled, pincode } = this.state;

    return (
      <div className="main-wrapper">
        <Header />
        <div className="check-availability-wrapper">
          <div className="avail-inner-wrapper">
            <div className="image-ui"><img src="/assets/images/deliveryguy.svg" alt="" /></div>
            <div className="content-ui">
              <h4 className="availability-heading">See if we can deliver to you</h4>
              <p className="availability-text">Enter your pincode to check delivery availability</p>
              <div className="pincode-wrapper">
                <form onSubmit={this.checkAvailability.bind(this)}>
                  <input id="pincode-field" maxLength="6" onChange={this.handleChange.bind(this)} type="text" placeholder="Enter Pincode" />
                  <input name="submit" ccc className={`pincode-submit ${disabled ? 'disabled' : ''}`} value="Check" />
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        {/* seoContent={meta_data} */}
      </div>
    );
  }
}

export default CheckDelivery;
