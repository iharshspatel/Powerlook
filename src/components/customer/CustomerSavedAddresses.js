import React, { Component } from 'react';

class CustomerSavedAddresses extends Component {

    render() {
        
        return (
           <>
            <div className="col-sm-6 added-address-container address-selected">
              <div className="container-inner-address">
                 <div className="address-block">
                    <div className="head-address-in">
                       <h4>Address 1</h4>
                       <span className="address-type-view">Office</span>
                    </div>
                    <div className="mark-right">
                       <span className="icon-check-sign"></span>
                    </div>
                    <div className="main-addess">
                       <span>Nishant Sharma</span>
                       <address>B Wing Flat no 504, PNG Building Near Powai Police station, Powai Mumbai - 400076</address>
                       <div className="contact-info">Mobile - 1234567890</div>
                    </div>
                 </div>
                 <div className="action-address">
                    <a href="javascript:void(0);" className="remove-link">Remove</a>
                    <a href="javascript:void(0);" className="add-link">EDIT</a>
                 </div>
              </div>
           </div>
          </>
        );
    }
}

export default CustomerSavedAddresses;
