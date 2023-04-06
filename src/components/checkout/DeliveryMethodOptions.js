import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {currencyFormat} from '../../utilities';
import DeliveryMethods from './DeliveryMethods';
import {updateCheckoutToStep} from '../../actions/checkout';

class DeliveryMethodOptions extends Component {

  constructor(props){
      super(props);
      this.state = {
        shippingMethod: props.shippingMethod,
        nextStep: props.nextStep,
        status: props.status
      };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'checkout' && nextProps.status != this.state.status){
      this.setState({
        shippingMethod: nextProps.shippingMethod,
        nextStep: nextProps.nextStep,
        status: nextProps.status
      });
    }
  }

  render() {
    const {nextStep, shippingMethod} = this.state;

    return (
      <div className={`block-payment ${nextStep > 2 ? 'done-block' : ''}`} style={{display: 'none'}}>
        <div className="head-block-detail">
           <div className="counter-payment">2</div>
           <h3 className="title-payment">Choose Delivery Option</h3>
           {
            nextStep > 2
            &&
            <>
              <div className="right-block-detail">
                  <div className="change-option-ui">
                     <a href="javascript:void(0);" className="change-option-text" onClick={() => this.props.updateCheckoutToStep(2)}>Change Option</a>
                  </div>
               </div>
               <div className="block-result-detail">
                  <div className="delivery-view">
                     <label>{shippingMethod.method_title}</label>
                     <p>{currencyFormat(shippingMethod.amount, 'INR')} - {shippingMethod.carrier_title}</p>
                  </div>
               </div>
            </>
           }
        </div>
        {
          nextStep == 2
          &&
          <DeliveryMethods />
        }
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingMethod: state.Checkout.progress.shippingMethod,
    nextStep: state.Checkout.nextStep,
    status: state.Checkout.status,
    compName: state.Checkout.compName
  }
}

export default connect(mapStatesToProps, {updateCheckoutToStep})(DeliveryMethodOptions);