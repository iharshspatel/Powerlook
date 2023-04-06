import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import AddAddressBlock from '../customer/AddAddressBlock';
import SaveAddressButton from '../customer/SaveAddressButton';
import ContentLoader from '../ContentLoader';
import { fetchShippingAddressById } from '../../actions/customer';

class CheckoutAddAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: {},
            addressId: null
        };
    }

    hideModal() {
        this.props.history.push('/checkout/address');
    }

    componentWillMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        const addressId = searchParams.get('id');
        const { defaultShippingId } = this.props;
        if (addressId) {
            this.setState({
                addressId
            });
            // fetchShippingAddressById(addressId).then(response => {
            //     const { data } = response;
            //     this.props.initialize({ ...data, is_default: defaultShippingId == data.entity_id, name: `${data.firstname} ${data.lastname}`, street: data.street.split("\n") });

            //     this.setState({
            //         address: data
            //     });
            // });
        }
    }

    render() {
        const { address, addressId } = this.state;

        return (
            <>
                <div className="back_bar">
                    <Link to="/checkout/address">
                        <img src="/assets/images/back-Btn-black.svg" alt="arrow-left" />
                        <span className="content">Delivery Address</span>
                    </Link>
                </div>
                <div className="m-box-white">
                    <div className="addAddress-page">
                        <div className="modal-head-block">
                            {
                                addressId
                                    ?
                                    <h4>Edit Address</h4>
                                    :
                                    <h4>Add New Address</h4>
                            }

                            <p>Be sure to click "Save" button when you've finished.</p>
                        </div>
                        {
                            addressId !== null && !Object.keys(address).length
                                ?
                                <ContentLoader />
                                :
                                <>
                                    <AddAddressBlock address={this.state.address} />
                                    <SaveAddressButton onHide={this.hideModal.bind(this)} />
                                </>
                        }

                    </div>
                </div>
            </>
        );
    }
}

const savedAddress = reduxForm({
    form: 'delivery_address'
})(CheckoutAddAddress)

const mapStatesToProps = (state) => {
    return {
        defaultShippingId: state.Customer.defaultShippingId
    }
}

export default connect(mapStatesToProps)(savedAddress);
