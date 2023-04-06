import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {currencyFormat} from '../../utilities';
import {fetchShippingMethods, updateShippingMethod} from '../../actions/checkout';

class DeliveryMethods extends Component {

  constructor(props){
      super(props);
      this.state = {
        selection: null,
        methods: props.shippingMethods,
        status: props.status
      };

      this.selectMethod = this.selectMethod.bind(this);
  }

  componentWillMount(){
    const {methods} = this.state;
    if(methods.length == 1){
      this.props.updateShippingMethod(methods[0]);
    }
  }

  // componentWillMount(){
  //   if(this.props.shippingAddress !== null){
  //       fetchShippingMethods(this.props.shippingAddress).then(response => {
  //         this.setState({
  //           methods: response.data
  //         });
  //       });
  //   }
  // }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.compName == 'checkout-shipping-address' && nextProps.status != this.state.status){
  //     fetchShippingMethods(nextProps.shippingAddress).then(response => {
  //       this.setState({
  //         methods: response.data,
  //         status: nextProps.status
  //       });
  //     });
  //   }
  // }

  selectMethod(event){
    const {methods} = this.state;
    this.setState({
      selection: methods.filter(value => event.target.value == value.carrier_code)[0]
    });
  }

  triggerClick(key){
    window.$$(`#shipping-block-${key}`).find('input[type=radio]').trigger('click');
  }

  render() {
    const {selection, methods} = this.state;
    
    if(methods.length <= 1)
      return null;

    return (
      <div className="content-block-detail delivery-options-fields">
        {
          methods.map(shippingMethod => {
            return <div key={shippingMethod.carrier_code} className="list-check-options-block">
                    <div className={`check-action-block-payment ${selection !== null && selection.carrier_code == shippingMethod.carrier_code ? 'card-active' : ''}`} id={`shipping-block-${shippingMethod.carrier_code}`} onClick={() => this.triggerClick(shippingMethod.carrier_code)}>
                       <div className="head-other-mathod">
                          <div className="custom-radio-ui">
                             <label>
                                <input defaultValue={shippingMethod.carrier_code} type="radio" className="option-input" name="delivery" onChange={this.selectMethod} />
                                <span className="filter-input"></span>
                             </label>
                          </div>
                          <div className="block-delivery-option">
                             <span>{shippingMethod.method_title}</span>
                             <p>{currencyFormat(shippingMethod.amount, 'INR')} - {shippingMethod.carrier_title}</p>
                          </div>
                          
                       </div>
                    </div>
                 </div>
          })
         }
         {
            selection !== null
            &&
            <div className="btn-block address-btn btn-one-state m-b30">
              <a href="javascript:void(0);" className="btn-fil-primary btn-action-payment"  onClick={() => this.props.updateShippingMethod(selection)}>Select</a>
            </div>
         }
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    shippingAddress: state.Checkout.progress.shippingAddress,
    shippingMethods: [...state.Customer.shippingMethods],
    status: state.Checkout.status,
    compName: state.Checkout.compName
  }
}

export default connect(mapStatesToProps, {updateShippingMethod})(DeliveryMethods);