import React, { Component } from 'react';
import {REFUNDMODE} from '../../constants';

class RefundModeFields extends Component {

  componentDidMount() {  
    const {input, field, payment_method} = this.props;
    if(field) {
      const options = field.select_option.split(',');       
      if (options && options.length > 0) {        
        
        const op = options[2].split("=>")[0].replace(/\s/, '')        
        this.props.setSelectedRefundModeOption(op);    
        input.onChange(op)
      }  
    }
  }

    render() {
        const {field, value, input, label, type, id, payment_method, meta: { touched, error }, selectedRefundModeOption} = this.props;
        const options = field.select_option.split(','); 
        let optionDesc = [];
        return (
            <>
              <hr className="divider m-t25 m-b28" />
              <h6>{field.label}</h6>
              {
                options.map((option, index) => {
                    option = option.split('=>');
                    optionDesc = option[1].split(':');
                    {/* Do not show Back to Source refund option in case of COD */}
                    if(payment_method == 'cashondelivery' && option[0].replace(/\s/, '') == REFUNDMODE.BACK_TO_SOURCE){
                      return null;
                    }
                    return (
                      <div key={index} className="return-method">
                         <div className="custom-radio-ui outline-btn">
                            <label>                              
                               <input checked={option[0].replace(/\s/, '') === selectedRefundModeOption} value={option[0].replace(/\s/, '')}
                                type="radio" className="option-input" name={field.inputname} 
                               onChange={(e) => {
                                this.props.setSelectedRefundModeOption(e.target.value); 
                                input.onChange(e);
                                }} />
                               <span className="filter-input"></span>
                               <h6>{typeof optionDesc[0] !== 'undefined' ? optionDesc[0] : option[1]}</h6>
                            </label>
                            {typeof optionDesc[1] !== 'undefined' && <p dangerouslySetInnerHTML={{__html: optionDesc[1]}}></p>}
                         </div>
                      </div>
                    )
                })
              }
              {touched && error && <div className="error-text">{error}</div>}
            </>
        );
    }
}

export default RefundModeFields;
