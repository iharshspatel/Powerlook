import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import { withRouter } from "react-router";
import CustomerSavedAddresses from '../customer/CustomerSavedAddresses';
import AddAddressBlock from '../customer/AddAddressBlock';
import {getSessionItem} from '../../utilities';
//import {updateCheckoutStep} from '../../actions/checkout';

class DeliveryBlock extends Component {

  constructor(props){
    super(props);
    this.state = {
      customer: props.customer,
      status: props.status
    };
  }

  componentWillMount(){
    if(!getSessionItem('token')){
      this.props.history.push('/checkout/shopping-bag');
    }else{
      // Update checkout progress
      //this.props.updateCheckoutStep(2);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.status != this.state.status && nextProps.compName == 'customer'){
      this.setState({
        customer: nextProps.customer,
        status: nextProps.status
      });
    }
  }

  render() {
    const {customer} = this.state;

    return (
      <div className="col-sm-8 itemBlock-base-leftBlock">
         {
          typeof customer.id !== 'undefined'
          &&
          <>
             <div className="cart-total-head">
                <h3>Select Delivery Address</h3>
             </div>
             <div className="addAddressContainer">
                  <div className="row">
                     <div className="col-sm-6 add-new-address">
                        <a href="javascript:void(0);" className="addAddressLink">
                           <div className="block-new">
                              <i className="icon-add"></i>
                              <span>Add New Address</span>
                           </div>
                        </a>
                     </div>
                     <CustomerSavedAddresses />
                  </div>
              </div>
          </>
         }
         <AddAddressBlock title={typeof customer.id === 'undefined' ? 'Add Your Delivery Address' : 'Add a New Address'} />
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    customer: {...state.Customer.info},
    status: state.Customer.status,
    compName: state.Customer.compName
  }
}

export default withRouter(connect(mapStatesToProps)(DeliveryBlock));