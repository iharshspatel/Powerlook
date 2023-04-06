import React, { Component } from 'react';

class RadioButtons extends Component {

  constructor(props){
    super(props);
    const {input, field, payment_method} = props;
    if(field) {
      const options = field.select_option.split(',');       
      if (options && options.length > 0) {                
        const op = options[1].split("=>")[0].replace(/\s/, '');                    
        this.props.setSelectedPackageOption(op, field);        
        input.onChange(op)
      }  
    }
  }

    render() {
        const {field, value, input, label, type, id, meta: { touched, error }, isBankDetailField, refundMode, selectedPackageOption} = this.props;
        const options = field.select_option.split(',');        
        if(typeof isBankDetailField !== 'undefined' && isBankDetailField){
          // Refund mode: Bank account
          if(refundMode != 2){
            return null;
          }
        }

        return (
            <div className={`form-group ${typeof isBankDetailField !== 'undefined' && isBankDetailField ? 'bank-field' : ''}`}> 
               <label className={field.required ? "required-field" : ""}>{field.label}</label>
               <div className="exchange-radio">
                  {
                    options.map((option, index) => {
                        option = option.split('=>');
                        return <div key={index} className="custom-radio-ui outline-btn">
                                  <label>
                                     <input checked={option[0].replace(/\s/, '') === selectedPackageOption} type="radio" className="option-input" name={field.inputname}
                                     value={option[0].replace(/\s/, '')} 
                                     onChange={(e) => {                                      
                                      this.props.setSelectedPackageOption(e.target.value, field); 
                                      input.onChange(e);
                                      }} />
                                     <span className="filter-input"></span>
                                     {option[1].replace(/\s/, '')}
                                  </label>

                                </div>
                    })
                  }
                  
               </div>
               {touched && error && <div className="error-text">{error}</div>}
            </div>
        );
    }
}

export default RadioButtons;
