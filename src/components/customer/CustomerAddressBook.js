import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { fetchCustomerAddresses, fetchShippingMethods, deleteShippingAddress } from '../../actions/customer';
import { updateDeliveryAddress } from '../../actions/checkout';
import { isAuth, trackwebEngageEvent } from '../../utilities';
import NewAddressModal from './NewAddressModal';
import { SHIPPING_DETAILS_UPDATED } from '../../constants';

class AddAddressBlock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selection: props.defaultShippingId,
      addresses: props.addresses,
      status: props.status,
      processing: false,
      loaded: false,
      cart: props.cart,
    };

    this.verifyShippingAvailability = this.verifyShippingAvailability.bind(this);
    this.triggerClick = this.triggerClick.bind(this);
    this.editAddress = this.editAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
  }

  componentWillMount() {
    if (isAuth()) {
      this.props.fetchCustomerAddresses();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.compName == 'addresses' && nextProps.status != this.state.status) {
      this.setState({
        selection: nextProps.defaultShippingId,
        addresses: nextProps.addresses,
        status: nextProps.status,
        loaded: true
      });
    }

    if (nextProps.compName == 'addresses' && this.state.status != nextProps.status) {
      this.setState({
        cart: nextProps.cart,
        status: nextProps.status
      });
    }

    if (nextProps && nextProps.order_price_summary && nextProps.order_price_summary.statusCode === "200") {
      this.setState({
        order_summary: nextProps.order_price_summary
      })
    }
  }

  verifyShippingAvailability(address) {
    if (this.state.processing === true)
      return;

    this.setState({
      processing: true
    });

    const { city, country_id, firstname, lastname, postcode, region, region_id, street, telephone, customer_id , state} = address;

    const shippingAddress =
    {
      city, country_id, firstname, lastname, postcode, region, region_id, street: street.split("\n"), telephone, customer_id
    };

    this.props.fetchShippingMethods(shippingAddress).then(response => {
      this.props.updateDeliveryAddress(shippingAddress);

      trackwebEngageEvent(SHIPPING_DETAILS_UPDATED , {
        "Shipping Address" : street ? street : '',
        "City":city ? city : '',
        "State": region ? region : '',
        "Country": "India" ,
      });

      const cartItems = [];
      
      if (this.state.cart && this.state.cart.items) {
        this.state.cart.items.map(item => {
          cartItems.push({
            'item_id': `${item.extension_attributes.skuu}`,
            'item_name': item.name,
            'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
            'discount': item.discount_amount ? Number(item.discount_amount) : 0,
            'item_category': item.extension_attributes.category,
            'price': Number(item.base_row_total_incl_tax),
            'quantity': item.qty
          });
        });
      }

      if (window.gtag) {
        window.gtag('event', 'add_shipping_info', {
          'currency': "INR",
          'value': this.state.order_summary && this.state.order_summary.grand_total ? this.state.order_summary.grand_total.amount : 0,
          'coupon': this.state.usedCoupon ? this.state.usedCoupon.code : "",
          'shipping_tier': "Air",
          'items': cartItems
        });
      }

      this.setState({
        processing: false
      });
    }).catch(error => {
      this.setState({
        processing: false
      });
    });
  }

  selectAddress(event) {
    this.setState({
      selection: event.target.value
    });
  }

  triggerClick(key) {
    window.$$(`#address-block-${key}`).find('input[type=radio]').trigger('click');
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null
    });
  }

  editAddress(data) {
    const { defaultShippingId } = this.props;
    this.props.initialize({ ...data, is_default: defaultShippingId == data.entity_id, name: `${data.firstname} ${data.lastname}`, street: data.street.split("\n") });
    window.getFooter().setState({
      renderElement: <NewAddressModal title="Edit Address" onHide={this.hideModal.bind(this)} />
    });
  }

  deleteAddress(entity_id) {
    if (window.confirm('Are you sure to delete this address?')) {
      this.props.deleteShippingAddress(entity_id);
    }
  }

  render() {
    const { addresses, defaultShippingId, selection, processing, loaded } = this.state;

    return (
      <div className={!loaded ? 'loading-block' : ''}>
        {
          loaded
          &&
          (
            addresses.length > 0
              ?
              addresses.map(address => {
                return <div key={address.entity_id} className="list-check-options-block">
                  <div className={`check-action-block-payment ${selection == address.entity_id ? 'card-active' : ''}`} id={`address-block-${address.entity_id}`} onClick={() => this.triggerClick(address.entity_id)}>
                    <div className="head-other-mathod">
                      <div className="custom-radio-ui">
                        <label>
                          <input checked={selection == address.entity_id} defaultValue={address.entity_id} type="radio" className="option-input" name="paymentSelection" onChange={this.selectAddress.bind(this)} />
                          <span className="filter-input"></span>
                        </label>
                      </div>
                      <div className="address-block-detail">
                        <h3>{address.firstname} {address.lastname}</h3>&nbsp;
                        {address.address_type ? <div className="address-for">{address.address_type}</div> : ''}
                        <div className="edit-remove">
                          <a href="javascript:void(0);" className="btn edit" onClick={(e) => this.editAddress(address)}>EDIT</a>
                          <a href="javascript:void(0);" className="btn remove" onClick={(e) => this.deleteAddress(address.entity_id)}>Remove</a>
                        </div>
                        <address>{address.street}, {address.city} {address.region} - {address.postcode}</address>
                        <div className="phone-no">+91 {address.telephone}</div>
                        {
                          selection == address.entity_id
                          &&
                          <div className="btn-block address-btn">
                            <a href="javascript:void(0);" className={`btn-fil-primary btn-action-payment loading ${processing === true ? "show" : ""}`} onClick={() => this.verifyShippingAvailability(address)}>Deliver Here</a>
                          </div>
                        }

                      </div>
                    </div>
                  </div>
                </div>
              })
              :
              <div className="no-record" style={{ padding: '15px' }}>No address found!</div>
          )
        }
      </div>

    );
  }
}

const savedAddress = reduxForm({
  form: 'delivery_address'
})(AddAddressBlock)

const mapStatesToProps = (state) => {
  return {
    addresses: [...state.Customer.addresses],
    defaultShippingId: state.Customer.defaultShippingId,
    status: state.Customer.status,
    compName: state.Customer.compName,
    cart: { ...state.Cart.cart },
    order_price_summary: state.Cart && state.Cart.order_summary ? state.Cart.order_summary[0] : null
  }
}

export default connect(mapStatesToProps, { fetchCustomerAddresses, updateDeliveryAddress, fetchShippingMethods, deleteShippingAddress })(savedAddress);
