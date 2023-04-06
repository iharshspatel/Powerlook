import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CustomerAddressBook from '../mobile/CustomerAddressBook';
import AddAddressBlock from '../customer/AddAddressBlock';
import SaveAddressButton from '../customer/SaveAddressButton';
import { fetchCustomerAddresses } from '../../actions/customer';
import { isAuth } from '../../utilities';

class CheckoutAddress extends Component {

    constructor(props) {
        super(props);

        this.state = {
            addresses: null,
            status: props.status
        };
    }

    componentWillMount() {
        if (isAuth()) {
            this.props.fetchCustomerAddresses();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.compName == 'addresses' && nextProps.status != this.state.status) {
            this.setState({
                addresses: nextProps.addresses,
                status: nextProps.status
            });
        }
    }

    hideModal() {
        this.props.history.push('/checkout/address');
    }

    render() {
        const { addresses } = this.state;

        if (addresses !== null && !addresses.length) {
            return (
                <>
                    <div className="back_bar">
                        <Link to="/shopping-bag">
                            <img src="/assets/images/back-Btn-black.svg" alt="arrow-left" />
                            <span className="content">Select Address</span>
                        </Link>
                    </div>
                    <div className="m-box-white">
                        <div className="addAddress-page">
                            <div className="modal-head-block">
                                <h4>Add New Address</h4>
                                <p>Be sure to click "Deliver to this address" when you've finished.</p>
                            </div>
                            <AddAddressBlock address={addresses} />
                            <SaveAddressButton onHide={this.hideModal.bind(this)} />
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="back_bar">
                    <Link to="/shopping-bag">
                        <img src="/assets/images/back-Btn-black.svg" alt="arrow-left" />
                        <span className="content">Delivery Address</span>
                    </Link>
                    <div className="step-number">STEP 1/2</div>
                </div>
                <div className="addNew-addressWrapper">
                    <Link className="btn-border addNew-address" to="/checkout/add-address">
                        <i className="add"></i>Add a new address
                    </Link>
                </div>
                <div className="m-box-white bottom-btn-margin">
                    <div className="priceBlock-base-priceHeader">Select Address</div>
                    <div className="content-block-detail m-block">
                        <CustomerAddressBook />
                    </div>
                </div>
            </>
        );
    }
}

const mapStatesToProps = (state) => {
    return {
        addresses: [...state.Customer.addresses],
        status: state.Customer.status,
        compName: state.Customer.compName
    }
}

export default connect(mapStatesToProps, { fetchCustomerAddresses })(CheckoutAddress);
