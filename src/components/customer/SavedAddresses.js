import React, { Component } from 'react';
import { connect } from 'react-redux';
import {fetchCustomerAddresses} from '../../actions/customer';
import SavedAddressBlock from './SavedAddressBlock';
import NewAddressModal from './NewAddressModal';

class SavedAddresses extends Component {
  constructor(props){
    super(props);
    this.state = {
      defaultShippingId: props.defaultShippingId,
      addresses: props.addresses,
      status: props.status
    };
  }

  componentWillMount(){
    const {addresses} = this.state;
    if(!addresses.length){
      this.props.fetchCustomerAddresses();
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'addresses' && this.state.status != nextProps.status){
      this.setState({
        defaultShippingId: nextProps.defaultShippingId,
        addresses: nextProps.addresses,
        status: nextProps.status
      });
    }
  }

  addNewAddress(){
    window.getFooter().setState({
      renderElement: <NewAddressModal callback={this.props.chooseBtnCallback} onHide={this.hideModal.bind(this)} />
    });
  }

  hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
  }

  render() {
    const {addresses, defaultShippingId} = this.state;

    return (
        <div className="content-saved-address">
          <div className="head-tabs">
             <h2>My Addresses</h2>
             <a href="javascript:void(0);" className="add-btn" onClick={this.addNewAddress.bind(this)}>
               <span className="icon-add"></span><span className="text">Add New Address</span>
            </a>
          </div>
          <div className="addAddressContainernew">
            {
              addresses.map(address => {
                return <SavedAddressBlock chooseBtnCallback={this.props.chooseBtnCallback} key={address.entity_id} data={address} defaultShippingId={defaultShippingId} />
              })
            }
          </div>
       </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    addresses: [...state.Customer.addresses],
    defaultShippingId: state.Customer.defaultShippingId,
    status: state.Customer.status,
    compName: state.Customer.compName
  }
}

export default connect(mapStatesToProps, {fetchCustomerAddresses})(SavedAddresses);
