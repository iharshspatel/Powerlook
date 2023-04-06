import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {viewProfile} from '../../actions/customer';
import {gender} from '../../constants';
import {dateFormat} from '../../utilities';

class ViewProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
      status: props.status
    };
  }

  componentWillMount(){
    const {data} = this.state;
    if(!Object.keys(data).length){
      this.props.viewProfile();
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.compName == 'profile' && this.state.status != nextProps.status){
      this.setState({
        data: nextProps.data,
        status: nextProps.status
      });
    }
  }

  render() {
    const {data} = this.state;
    data.phone_number = '';
    data.alternate_contact_number = '';
    if(typeof data.custom_attributes !== 'undefined'){
      data.custom_attributes.map(attr => {
        data[attr.attribute_code] = attr.value;
        //return attr.attribute_code == 'phone_number';
      });

      //data.phone_number = attrs.length > 0 ?  attrs[0].value : '';
    }
    return (
        <div className="profile-view-content">
          <div className="head-tabs">
             <h2>My Profile</h2>
             <p>You can edit/update your profile information by click on edit profile button.</p>
          </div>
          <div className="row">
             <div className="col-sm-6">
                <fieldset className="view-fields">
                   <label>Full Name</label>
                   <p>{data.firstname} {data.lastname}</p>
                </fieldset>
             </div>
             <div className="col-sm-6">
                <fieldset className="view-fields">
                   <label>Email</label>
                   <p>{data.email}</p>
                </fieldset>
             </div>
             <div className="col-sm-6">
                <fieldset className="view-fields">
                   <label>Phone Number</label>
                   <p>+91 {data.phone_number}</p>
                </fieldset>
             </div>
             <div className="col-sm-6">
                <fieldset className="view-fields">
                   <label>Alternate Phone Number</label>
                   <p>{data.alternate_contact_number}</p>
                </fieldset>
             </div>
             <div className="col-sm-6">
                <fieldset className="view-fields">
                   <label>Date of birth</label>
                   <p>{typeof data.dob !== 'undefined' ? dateFormat(data.dob, 'LL') : ''}</p>
                </fieldset>
             </div>
             <div className="col-sm-6">
                <fieldset className="view-fields">
                   <label>Gender</label>
                   <p>{typeof data.gender !== 'undefined' ? gender[data.gender] : ''}</p>
                </fieldset>
             </div>
          </div>
          <div className="btn-block-form">
             <Link to="/account/profile/edit" className="btn-fil-primary large-btn editprofile-btn">Edit Profile</Link>
          </div>
       </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    data: {...state.Customer.customer},
    status: state.Customer.status,
    compName: state.Customer.compName
  }
}

export default connect(mapStatesToProps, {viewProfile})(ViewProfile);
