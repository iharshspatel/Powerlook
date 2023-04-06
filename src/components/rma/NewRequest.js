import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {ToastsStore} from 'react-toasts';
import Header from '../Header';
import FooterCheckout from '../FooterCheckout';
import Breadcrumb from '../Breadcrumb';
import {fetchOrderDetailsForRma} from '../../actions/rma';
import OrderListItemProductSkeleton from  '../customer/OrderListItemProductSkeleton';
import ExtraFields from './ExtraFields';
import RmaItem from './RmaItem';
import {saveRmaRequest} from '../../actions/rma';

const required = value => value && typeof value !== 'undefined' && value !== null ? undefined : 'This is a required field.';

const renderField = ({ input, hideError, spanClass, className, label, type, required, meta: { touched, error, warning } }) => (
  <>
    <label className={typeof required !== 'undefined' && required === true ? "required-field" : ''}>
       <input {...input} placeholder={label} type={type} className={className ? className : ""} />
       <span className={spanClass ? spanClass : "filter-input"}></span>
       {label}
    </label>
    {!hideError && touched && ((error && <span className="error-text">{error}</span>) || (warning && <span className="error-text">{warning}</span>))}
  </>
);

const renderTextareaField = ({ input, hideError, spanClass, className, label, type, meta: { touched, error, warning } }) => (
  <>
    <label className={typeof required !== 'undefined' && required === true ? "required-field" : ''}>{label}</label>
    <textarea {...input} placeholder={label} className={className ? className : ""}></textarea>
    {!hideError && touched && ((error && <span className="error-text">{error}</span>) || (warning && <span className="error-text">{warning}</span>))}
  </>
);

class NewRequest extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderId: props.match.params.orderId,
      data: {},
      processing: false,
      agree: false,
      errors: {}
    };

    this.cancelRequest = this.cancelRequest.bind(this);
  }

  componentWillMount(){
    const {orderId, data} = this.state;
    this.props.change('resolution_type', '1');
    fetchOrderDetailsForRma(orderId).then(response => {
      response.data[0].extra_fields = [{
                "input_type": "radio",
                "label": "Package Condition?",
                "inputname": "package_condition",
                "select_option": "0=>Open,1=>Packed",
                "validationtype": null,
                "required": "1",
                "status": "1",
                "sort": "1"
            }, ...response.data[0].extra_fields];
      this.setState({
        data: response.data[0]
      });
    }).catch(error => {
      this.props.history.push(`/account/myorders/detail/${orderId}`);
    });
  }

  cancelRequest(e){
    e.preventDefault();
    const {orderId, processing} = this.state;
    if(processing === true)
      return;
    this.props.history.push(`/account/myorders/detail/${orderId}`);
  }

  submitRequest(values){    

    if (typeof values.return_item === 'undefined' || typeof values.item_checked === 'undefined')
    {      
      this.setState({
        errors: { itemsChecked: 'Please Select Product' }
      });      
      return
    }else if(Object.keys(values.return_item).length == 0 || Object.keys(values.item_checked).length == 0){
      this.setState({
        errors: { itemsChecked: 'Please Select Product' }
      });      
      return
    }

    values.agree = this.state.agree;
    if(values.agree == false){
      this.setState({
        errors: { agree: 'This is a required field.' }
      });      
      return
    }
    this.setState({
      errors: { }
    });       
    
    const {orderId, processing} = this.state;
    if(processing === true)
      return;
    this.setState({
      processing: true
    });
    saveRmaRequest(orderId, values).then(response => {
      ToastsStore.success(response.data);
      this.props.history.push(`/account/returns`);
    }).catch(error => {
      this.setState({
        processing: false
      });
    });
  }

  cancelRequest(e){
    e.preventDefault();
    this.props.history.push(`/account/myorders/detail/${this.state.orderId}`);
  }

  render() {
    const {orderId, data, processing, errors} = this.state;
    const { handleSubmit } = this.props;
    const checkboxLabel = 'I agree to return the item(s) back in original condition. The replacement/exchange will be delivered once the original item(s) is received by Powerlook.'

    return (
        <div className="main-wrapper">
            <Header />
            <div className="product-detail-block return-exchange-block">
              <div className="container">
                <Breadcrumb data={[{link: '/account', label: 'My Account'}, {link: '/account/myorders', label: 'My Orders'}, {link: `/account/myorders/detail/${orderId}`,label: `ID ${orderId}`}, {label: 'Return/Exchange'}]} />
                <div className="inner-heading">
                  <h4>Return / Exchange</h4>
                </div>
                <form onSubmit={handleSubmit(this.submitRequest.bind(this))}>
                <div className="tab-nav-sec">
                      <div className="tab exchange-tab">
                         <div className="custom-radio-ui outline-btn">
                            <Field label="Exchange" validate={[required]} component={renderField} type="radio" className="option-input"  name="resolution_type" value="1" />
                         </div>
                     </div>
                     <div className="tab Return-tab">
                        <div className="custom-radio-ui outline-btn">
                            <Field hideError={true} label="Return" validate={[required]} component={renderField} type="radio" className="option-input"  name="resolution_type" value="0" />
                         </div>
                     </div>
                </div>
                <div className="exchange-content active">
                  <div className="row return-tab-ui">
                     <div className="col-md-8">
                        <div className="tab-inner-block">
                            <div className="tab-content-sec m-b32">
                               <div className="exchange-wrapper">
                                  {
                                    typeof data.orderDetails !== 'undefined' 
                                    && 
                                    data.orderDetails.length > 0
                                    ?
                                    data.orderDetails.map((item, index) => {
                                      return <RmaItem reasons={data.reasons} required={required} item={item} key={index} />
                                    })
                                    :
                                    <OrderListItemProductSkeleton count={2} />
                                  }
                                  { errors && errors.itemsChecked ? <span className="error-text">{errors.itemsChecked}</span> : '' }
                               </div>
                            </div>
                            {/*<div className="form-group">
                                <Field validate={[required]} label="Please explain the issue in detail" component={renderTextareaField} name="additional_info" />
                            </div>*/}
                            {
                              typeof data.extra_fields !== 'undefined' 
                              && 
                              <ExtraFields order={data} fields={data.extra_fields} />
                            }

                            <hr className="divider m-t32 m-b28" />
                            <div className="confirmation-block">
                              <h4>Return Policy</h4>
                              <div className="pre">
                                {data.return_policy}
                              </div>
                            </div>
                            
                            <div className="confirmation-block">
                               <h4>Before we place an order for your replacement or exchange</h4>
                               <div className="check-box-block">
                                  {/* <Field required={true} validate={[requiredCheckbox]} label="I agree to return the item(s) back in original condition. The replacement/exchange will be delivered once the original item(s) is received by Powerlook." type="checkbox" component={renderFieldCheckbox} spanClass="check-ui" name="agree" /> */}

                                  <label className="required-field">
                                    <input type='checkbox' placeholder={checkboxLabel} name="agree"
                                    onChange={(e) => {   
                                      if(e.target.checked){
                                        this.setState({
                                          agree: e.target.checked,
                                          errors: {}
                                        })
                                      }else{
                                        this.setState({
                                          agree: e.target.checked,
                                          errors: { agree: 'This is a required field.' }
                                        })
                                      }                                                                                                                                                     
                                      }} />
                                    <span className='check-ui'></span>{checkboxLabel}
                                  </label>
                                  { errors && errors.agree ? <span className="error-text">{errors.agree}</span> : '' }
                               </div>
                            </div>

                            <div className="btn-block-form m-t10 lg-btns m-b30">
                               <button disabled={processing} type="submit" className={`btn-fil-primary large-btn vam load ${processing ? 'show' : ''}`}>Confirm</button>
                               <button disabled={processing} className="btn-border-secondary large-btn cancel-btn vam" onClick={this.cancelRequest.bind(this)}>Cancel</button>
                            </div>
                        </div>      
                     </div>
                  </div>
                </div>
                </form>
              </div>
            </div>
            <FooterCheckout />
        </div>
    );
  }
}

export default reduxForm({
  form: 'rma_request',
  destroyOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(NewRequest)
