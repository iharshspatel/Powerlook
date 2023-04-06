import React, { Component } from 'react';
import {RESOLUTIONTYPE} from '../../constants';
import {currencyFormat, dateFormat} from '../../utilities';

const required = value => value ? undefined : 'This is a required field.';

class ExtraFieldsDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    };
  }

  componentWillReceiveProps(nextProps){
    if(this.state.data === null && this.state.data != nextProps.data){
      this.setState({
        data: nextProps.data
      });
    }
  }

  render() {
    const {data} = this.state;

    if(data === null)
      return null;

    return (
      <div className="address-payement-info p-t0">

         <div className="row">
            <div className="col-sm-6">
               <div className="exchange-details">
                  <div className="priceBlock-base-priceHeader">Resolution Type</div>
                  <p>{data.resolution_type == RESOLUTIONTYPE.EXCHANGE ? 'Exchange Product' : 'Return Product'}</p>
               </div>
            </div>
            {
              data.resolution_type == RESOLUTIONTYPE.RETURN
              &&
              <>
                <div className="col-sm-6">
                   <div className="exchange-details">
                      <div className="priceBlock-base-priceHeader">Refundable Amount</div>
                      <p>{currencyFormat(data.refund_amount, 'INR')}</p>
                   </div>
                </div>
                <div className="col-sm-6">
                   <div className="exchange-details">
                      <div className="priceBlock-base-priceHeader">Return Shipment AWB</div>
                      <p>{data.return_shipment_awb}</p>
                   </div>
                </div>
              </>
            }
            <div className="col-sm-6">
               <div className="exchange-details">
                  <div className="priceBlock-base-priceHeader">Date of Return Pickup Generated</div>
                  <p>{dateFormat(data.created_at, 'DD MMM, YYYY')}</p>
               </div>
            </div>
         </div>
         {
          typeof data.extra_fields !== 'undefined' 
          &&
          data.extra_fields.length > 0
          &&
          <div className="row">
              <div className="col-sm-6">
                 <div className="exchange-details">
                    <div className="priceBlock-base-priceHeader">Package Condition</div>
                    <p>{data.package_condition == '0' ? 'Open' : 'Packed'}</p>
                 </div>
              </div>
              {
                data.extra_fields.map((field, index) => {
                  if(field.value == '')
                    return null;
                  
                  return <div key={index} className="col-sm-6">
                           <div className="exchange-details">
                              <div className="priceBlock-base-priceHeader">{field.label}</div>
                              <>
                              {
                                typeof field.type !== 'undefined' && field.type == 'date'
                                ?
                                (
                                  field.value
                                  ?
                                  <p dangerouslySetInnerHTML={{__html: dateFormat(field.value, 'DD MMM, YYYY')}}></p>
                                  :
                                  <p>--</p>
                                )
                                
                                :
                                <p dangerouslySetInnerHTML={{__html: field.value}}></p>
                              }
                              </>
                              
                           </div>
                        </div>
                })
              }
              
           </div>
         }
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    resolutionType: typeof state.form.rma_request.values !== 'undefined' && typeof state.form.rma_request.values.resolution_type !== 'undefined' ? state.form.rma_request.values.resolution_type : null
  }
}

export default ExtraFieldsDetail