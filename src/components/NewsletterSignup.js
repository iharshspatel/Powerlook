import React, { Component } from 'react';
import { ToastsStore } from 'react-toasts';
import { newletterSignup } from '../actions/customer';
import { trackwebEngageEvent } from '../utilities';
import Error from './Error';
import  { SIGN_UP_FOR_NEWSLETTER } from '../constants';

class NewsletterSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            processing: false
        };
    }

    subscribe(e) {
        e.preventDefault();
        const { value } = this.refs.email;
        if (this.state.processing === true) {
            return;
        }
        this.setState({
            processing: true
        });
        newletterSignup(value).then(response => {
            window.$$(this.refs.email).val('');
            this.setState({
                processing: false
            });
            
            trackwebEngageEvent(SIGN_UP_FOR_NEWSLETTER , {"Email":value});
            ToastsStore.success(response.data);
        }).catch(error => {
            this.setState({
                processing: false,
                errors: typeof error.response.data[0] !== 'undefined' ? error.response.data[0] : {}
            });
        })
    }

    render() {
        const { errors, processing } = this.state;

        return (
            <div className="footer-signup">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-xl-6">
                            <div className="signup-head">
                                <h4>Get Coupons & Offers</h4>
                                <p>You may unsubscribe at any moment. For that purpose, <br className="d-none d-lg-block" />
                                    please find our contact info in the legal notice.</p>
                            </div>
                        </div>
                        <div className="col-lg-1 d-none d-xl-block"></div>
                        <div className="col-md-6 col-xl-5">
                            <div className="signup-form">
                                <form onSubmit={this.subscribe.bind(this)}>
                                    <input ref="email" type="email" placeholder="Your email address" />
                                    <input className={`submit-btn load ${processing ? 'show' : ''}`} type="submit" value="Subscribe" />
                                </form>
                            </div>
                            {typeof errors.email !== 'undefined' && <Error text={errors.email} />}
                            <label className="signup-label"><em>*</em> Don't worry we don't spam</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsletterSignup;
