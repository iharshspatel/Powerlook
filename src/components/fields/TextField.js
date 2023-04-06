import React, { Component } from 'react';

class TextField extends Component {

    render() {
        const {field, value, input, label, type, id, meta: { touched, error }, isBankDetailField, refundMode} = this.props;

        return (
            <div className={`form-group m-t32 ${typeof isBankDetailField !== 'undefined' && isBankDetailField ? 'bank-field' : ''}`}>
               <label className={field.required ? "required-field" : ""}>{field.label}</label>
               <input defaultValue={input.value} type="text" name={field.inputname} placeholder={field.label} onBlur={input.onChange} 
               maxLength={field.inputname == 'ifsc_code' ? 11 : ''}
               pattern={field.inputname == 'bank_account_number' ? '[0-9]+' : field.inputname == 'ifsc_code' ? '.{11}' : null} 
               title={field.inputname == 'bank_account_number' ? "Field must be numbers only"  : field.inputname == 'ifsc_code' ? "Field must be 11 characters long"  : null} />
               {touched && error && <div className="error-text">{error}</div>}
            </div>
        );
    }
}

export default TextField;
