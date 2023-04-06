import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

const renderField = ({ input, className, placeholder, maxLength, minLength, autofocus, type, meta: { touched, error, warning } }) => (
  <>
    <input {...input} placeholder={placeholder} maxLength={maxLength} minLength={minLength} autofocus={autofocus ? autofocus : "false"} type={type} className={className ? className : ""} />
    {touched && ((error && <span className="error-text">{error}</span>) || (warning && <span className="error-text">{warning}</span>))}
  </>
);

class StreetAddressBlock extends Component {

    constructor(props){
      super(props);
    }

    componentDidMount(){
      for(let index = this.props.fields.length; index < 3; index++){
        this.props.fields.push('');
      } 
    }

    render() {
        const { fields } = this.props;
        const labels = ['(Flat, House no., Building, Company, Apartment)', '(Area, Colony, Street, Sector, Village)'];
        const placeholders = ['Enter delivery address here', 'Enter delivery address here', 'Eg. Behind the park'];
        const titles = ['Address 1', 'Address 2', 'Landmark'];

        return (
          <>
            {
              fields.map((field, index) => {
                  return <div className="col-sm-12" key={index}>
                             <div className="fields-block">
                                <label className="title required">{titles[index]} <span className="optional">{labels[index]}</span></label>
                                <Field
                                   name={field}
                                   component={renderField}
                                   type="text"
                                   className="form-control"
                                   placeholder={placeholders[index]}
                                 />
                             </div>
                          </div>
              })
            }
            
          </>
        );
    }
}

export default reduxForm({
  form: 'delivery_address'
})(StreetAddressBlock)