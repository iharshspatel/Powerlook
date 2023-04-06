import React, { Component } from 'react';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { applyCouponCode, removeCouponCode, getCart, getCouponsList, getOrderSummary } from '../../actions/cart';
import { saveWalletTotalsInfo } from '../../actions/checkout';
import { ToastsStore } from 'react-toasts';
import { trackwebEngageEvent } from '../../utilities';
import {COUPAN_CODE_FAILED} from '../../constants';
class ApplyCouponCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coupons: null,
            processing: false,
            selectedPaymentOption: props.selectedPaymentOption
        };
        
        this.applyCoupon = this.applyCoupon.bind(this);
        this.applyCouponCode = this.applyCouponCode.bind(this);
        this.removeCouponCode = this.removeCouponCode.bind(this);
    }

    componentWillMount() {
        getCouponsList().then(response => {
            this.setState({
                coupons: response.data.filter(c => c.code != 'ROHIT10')
            });
        });
    }

    applyCoupon(e) {
        e.preventDefault();
        this.applyCouponCode(this.refs.couponCode.value);
    }

    applyCouponCode(couponCode) {        
        var selectedPaymentOption = this.state.selectedPaymentOption        
        let usedCoupon = this.state.coupons.find(c => c.code === couponCode)        
        const couponCodeValidationMsg = `The coupon code "${couponCode}" is not valid for the selected payment method.`

        if (selectedPaymentOption === 'cashondelivery' && usedCoupon && usedCoupon.isOnlyForPrepaid == "1") {
            ToastsStore.error(couponCodeValidationMsg);
            return;
        }  

        const { processing } = this.state;
        if (processing === true)
            return;

        this.setState({
            processing: true
        });

        applyCouponCode(couponCode).then(response => {
            this.setState({
                processing: false
            });
            ToastsStore.success(response.data[0].response);
            // Refresh Totals
            if (typeof response.data[0].totals !== 'undefined') {
                this.props.saveWalletTotalsInfo(response.data[0].totals);
            } else {
                this.props.getCart();
                this.props.getOrderSummary()
            }
            this.props.onHide();
        }).catch(error => {
            this.setState({
                processing: false
            });
            trackwebEngageEvent(COUPAN_CODE_FAILED, {
                "Reason":error.response.data[0].response,
                "Coupon Code":couponCode
            })
            ToastsStore.error(error.response.data[0].response);
            this.props.onHide();
        });
    }

    removeCouponCode(e) {
        e.preventDefault();
        const { processing } = this.state;
        if (processing === true)
            return;

        this.setState({
            processing: true
        });

        removeCouponCode().then(response => {
            this.setState({
                processing: false
            });
            ToastsStore.success(response.data[0].response);
            // Refresh Totals
            if (typeof response.data[0].totals !== 'undefined') {
                this.props.saveWalletTotalsInfo(response.data[0].totals);
            } else {
                this.props.getCart();
                this.props.getOrderSummary()
            }
            this.props.onHide();
        }).catch(error => {
            this.setState({
                processing: false
            });
            ToastsStore.error(error.response.data[0].response);
            this.props.onHide();
        });
    }

    render() {

        const { coupons } = this.state;

        return (
            <div className="inner-content-modal">
                <div className="apply-coupon">
                    <form onSubmit={this.applyCoupon}>
                        <input required={true} ref="couponCode" type="text" className="text-field" placeholder="Enter coupon code" />
                        <input type="submit" className="btn-black" value="APPLY" />
                    </form>
                </div>
                {
                    coupons === null
                        ?
                        <div className="available-coupons">
                            <h3>Available Coupons</h3>
                            <ul>
                                <li>
                                    <div><Skeleton width={143} height={32} /></div>
                                    <div className="block-coupon-disc"><Skeleton width={410} height={48} /></div>
                                </li>
                            </ul>
                        </div>
                        :
                        coupons.length > 0
                            ?
                            <div className="available-coupons">
                                <h3>Available Coupons</h3>
                                <ul>
                                    {
                                        coupons.map(coupon => {
                                            return coupon.IsVisibleInList == true ? <li key={coupon.id}>
                                                <div className="coupon-code">{coupon.code}</div>
                                                {
                                                    coupon.used === true
                                                        ?
                                                        <a href="javascript:void(0);" onClick={this.removeCouponCode
                                                        } className="apply-coupon-link" style={{ color: 'red' }}>REMOVE</a>
                                                        :
                                                        <a href="javascript:void(0);" onClick={(e) => {
                                                            this.applyCouponCode(coupon.code)
                                                        }} className="apply-coupon-link">APPLY</a>
                                                }
                                                <div className="block-coupon-disc">
                                                    <p>{coupon.description}</p>
                                                    <span>Use the code {coupon.code}</span>
                                                </div>
                                            </li>
                                            :
                                            ''
                                        })
                                    }
                                </ul>
                            </div>
                            :
                            ''
                }

            </div>
        );
    }
}

const mapStatesToProps = (state) => {
    return {      
        selectedPaymentOption: state.Checkout.selectedPaymentOption
    }
  }

export default connect(mapStatesToProps, { saveWalletTotalsInfo, getCart, getOrderSummary })(ApplyCouponCode);
