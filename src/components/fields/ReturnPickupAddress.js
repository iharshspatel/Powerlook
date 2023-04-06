import React, { Component } from 'react';
import SavedAddresses from '../customer/SavedAddresses';
import Modal from '../Modal';

class ReturnPickupAddress extends Component {

    constructor(props){
      super(props);
      this.state = {
        showTextarea: false,
        shipping: props.shipping
      };
    }

    componentDidMount(){
      const {shipping, field} = this.props;

      this.props.change('shipping_address_id', shipping.entity_id);
      this.props.change(field.inputname, `${shipping.firstname} ${shipping.lastname}, ${shipping.street}, ${shipping.city} ${shipping.region} - ${shipping.postcode}`);
    }

    toggleAddressField(){
      window.getFooter().setState({
          renderElement: <Modal 
                            id="addresses-modal"
                            show={true}
                            onHide={this.hideModal.bind(this)}
                              header={<h4>Choose {`${this.props.field.label}`}</h4>}
                              body={<SavedAddresses chooseBtnCallback={this.chooseAddress.bind(this)} />}
                          />
      });
      // this.setState({
      //   showTextarea: !this.state.showTextarea
      // });
    }

    chooseAddress(shipping){
      this.setState({
        shipping
      });
      this.props.change('shipping_address_id', shipping.entity_id);
      this.props.change(this.props.field.inputname, `${shipping.firstname} ${shipping.lastname}, ${shipping.street}, ${shipping.city} ${shipping.region} - ${shipping.postcode}`);
    }

    hideModal(){
        window.getFooter().setState({
          renderElement: null
        });
    }

    render() {
        const {showTextarea, shipping} = this.state;
        const {field, value, input, label, type, id, meta: { touched, error }} = this.props;

        return (
            <>
              <hr className="divider m-t32 m-b28" />
              <div className="address-content">
                <h6 className={field.required ? "required-field" : ""}>{field.label}</h6>
                {
                  showTextarea === true
                  ?
                  <div className="form-group">
                     <textarea defaultValue={input.value} name={field.inputname} placeholder={field.label} onBlur={input.onChange}></textarea>
                     {touched && error && <div className="error-text">{error}</div>}
                     <div className="m-t16">
                      <a href="javascripit: void(0);" className="btn-border-secondary" onClick={this.toggleAddressField.bind(this)}>Cancel</a>
                     </div>
                  </div>
                  :
                  <>
                    <p>
                      {shipping.firstname} {shipping.lastname}<br />
                      {shipping.street}, {shipping.city}<br />
                      {shipping.region} - {shipping.postcode}<br />
                    </p>
                    {/* <a href="javascripit: void(0);" className="text-btn" onClick={this.toggleAddressField.bind(this)}>Change address</a> */}
                  </>
                }
              </div>
            </>
        );
    }
}

export default ReturnPickupAddress;
