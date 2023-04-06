import React, { Component } from 'react';
import { connect } from 'react-redux';
import Error from '../Error';
import {checkPincodeAvailability} from '../../actions/products';
import {addPincodeToMemory} from '../../actions/customer';

class CheckDeliveryAvailability extends Component {

  constructor(props){
    super(props);
    this.state ={
      response: null,
      error: null,
      processing: false,
      pincode: props.pincode
    };
  }

  componentDidMount(){
    const $ = window.$$;
    if ($('.block-pin-ui .pass').length >0) {
        $('.block-pin-ui input.pass').keyup(function(e) {
            if (e.which == 8 || e.which == 46) {
                $(this).prev('input').focus();
            }
            else {
                $(this).next('input').focus();
            }
        });
    }
  }

  getPinCode(){
    const $ = window.$$;
    let pincode = '';
    $('.block-pin-ui input.pass').each(function(){
      pincode += $(this).val();
    });

    return pincode;
  }

  checkPincode(e){
    e.preventDefault();
    if(this.state.processing === true)
      return;

    const pincode = this.refs.pincode.value;//this.getPinCode(); //this.refs.pincode.value;

    if(pincode.replace(/\s/, '') == '' || isNaN(pincode) || pincode.length != 6){
      this.setState({
        error: "Please enter valid pincode",
        response: null
      });
    }else{
      this.setState({
        error: null,
        response: null,
        processing: true
      });
      checkPincodeAvailability(pincode).then(response => {
        this.setState({
          processing: false,
          response: response.data[0]
        });
        this.props.addPincodeToMemory(pincode);
      });
    }
  }

  render() {

    const {error, processing, response} = this.state;

    return (
        <>
          <div className="pincode-blocking">
             <form onSubmit={this.checkPincode.bind(this)}>
               <div className="block-pin-ui newsletterBlock">
                  <input ref="pincode" type="text" maxLength="6" className="pass-in" placeholder="Enter pincode" />
                  <button type="submit" className={`btn-fil-primary pincode-check pincode-button load ${processing === true ? "show" : ""}`}>Check</button>
               </div>
               {/*<input ref="pincode" type="text" placeholder="Enter pincode" className="pincode-code" />*/}
               {error !== null && <Error text={error} />}
             </form>
          </div>
          {
            response !== null
            ?
              response.shipping.status === false
              ?
                <p className="error-text">{response.shipping.label}</p>
              :
                <>
                  <p className="pincode-enterPincode">Please enter the PIN code to check cash/card delivery available.<br /> Return and Exchange will be available for 7 days from the date of order delivery.</p>
                  <div className="delivery-options availability">
                    <ul className="offer-list">
                      <li>{response.shipping.label}</li>
                      {
                        <li>{response.COD.label}</li>
                      }
                    </ul>
                  </div>
                </>
            :
              <p className="pincode-enterPincode">Please enter the PIN code to check cash/card delivery available.<br /> Return and Exchange will be available for 7 days from the date of order delivery.</p>
          }
        </>
    );
  }
}


const mapStatesToProps = (state) => {
    return {
        pincodeAvail: state.Customer.pincode
    }
}

export default connect(mapStatesToProps, {addPincodeToMemory})(CheckDeliveryAvailability);
