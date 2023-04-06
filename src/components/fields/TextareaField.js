import React, { Component } from 'react';

class TextareaField extends Component {

    render() {
        const {field, value, input, label, type, id, meta: { touched, error }, isBankDetailField, refundMode} = this.props;

        return (
            <div className={`form-group ${typeof isBankDetailField !== 'undefined' && isBankDetailField ? 'bank-field' : ''}`}>
               <label className={field.required ? "required-field" : ""}>{field.label}</label>
               <textarea defaultValue={input.value} name={field.inputname} placeholder={field.label} onBlur={input.onChange}></textarea>
               {touched && error && <div className="error-text">{error}</div>}
            </div>
        );
    }
}

export default TextareaField;
