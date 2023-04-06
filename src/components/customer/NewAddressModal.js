import React, { Component } from 'react';
import Modal from '../Modal';
import AddAddressBlock from './AddAddressBlock';
import SaveAddressButton from './SaveAddressButton';

class NewAddressModal extends Component {

  constructor(props){
      super(props);
  }

  hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
  }

  render() {
      const {title, callback} = this.props;

      return (
          <Modal 
            id="new-address-modal"
            show={true}
            onHide={this.props.onHide}
            dialogClass="modal-660"
            header={<h4>{typeof title !== 'undefined' ? title : "Add New Address"}</h4>}
            body={<AddAddressBlock />}
            footerClass="btn-block-form btn-modal-section btn-auto text-left modal-footer-static"
            footer={<>
                       <SaveAddressButton callback={callback} onHide={this.hideModal}/>
                       <a href="javascript:void(0);" className="btn-border-secondary large-btn cancel-btn vam" data-dismiss="modal">Cancel</a>
                    </>}
          />
      );
  }
}

export default NewAddressModal