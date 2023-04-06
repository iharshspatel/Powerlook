import React, { Component } from 'react';
import Dropdown from '../Dropdown';

class SelectField extends Component {

    render() {
        const {field, value, input, label, type, id, meta: { touched, error }, isBankDetailField} = this.props;
        const options = field.select_option.split(',');
        let newOptions = {};
        let tmpOption = null;

        options.map((option, index) => {
          tmpOption = option.split('=>');
          newOptions = {...newOptions, [tmpOption[0].replace(/\s/, '')]: tmpOption[1].replace(/\s/, '')};
        });

        // Initialize the redux form state to first option for first time

        if(input.value === ''){
          if((typeof isBankDetailField !== 'undefined' && isBankDetailField) || field.inputname == 'return_pickup_time'){
            this.props.change(field.inputname, Object.keys(newOptions)[0]);
          }
        }

        return (
            <>
              <div className={`${field.inputname == 'return_pickup_time' ? 'dropdown return_pickup_time' : 'form-group'} ${typeof isBankDetailField !== 'undefined' && isBankDetailField ? 'bank-field' : ''}`}>
                {
                  field.inputname == 'return_pickup_time'
                  ?
                  <h6 className={field.required ? "required-field" : ""}>{field.label}</h6>
                  :
                  <label className={field.required ? "required-field" : ""}>{field.label}</label>
                }
                <Dropdown name={field.inputname} options={newOptions} callback={input.onChange} />
                {touched && error && <div className="error-text">{error}</div>}
              </div>
            </>
        );
    }
}

export default SelectField;
