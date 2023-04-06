import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import HeaderCheckout from './HeaderCheckout';
import ShoppingBagBlock from './checkout/ShoppingBagBlock';
import Footer from './Footer';
import CartSubTotalBlock from './checkout/CartSubTotalBlock';
import WishListProducts from './products/WishListProducts';
import ProductCategoriesBlock from './home/ProductCategoriesBlock';
import { getCart, getCheckoutText } from '../actions/cart';
import { isMobile } from '../utilities';

class Shoppingbag extends Component {

    constructor(props) {
        super(props);

        this.state = {
            empty: false,
            categories: [],
            status: props.status,
            checkoutText: null
        };
    }

    async componentWillMount() {
        this.props.getCart();
        try {
            let res = await getCheckoutText();
            this.setState({
                checkoutText: res.data[0].text
            })
        } catch (error) {
            console.error("ERROR GET CHECKOUT TEXT ", error)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.compName == 'empty-cart' && this.state.status != nextProps.status) {
            this.setState({
                empty: true,
                status: nextProps.status,
                categories: nextProps.components.category ? nextProps.components.category : []
            });
        }
    }

    render() {
        const { empty, categories } = this.state;

        return (
            <div className="main-wrapper">
                <HeaderCheckout />
                <div className={`cart-block-container ${empty === true ? 'empty-product' : ''}`}>
                    <div className="container sm-container">
                        {
                            empty === true
                                ?
                                <div className="completeOrderContainer padding-cntnr">
                                    <img src="/assets/images/shopping-bag.png" alt="Empty Cart" />
                                    <h1 className="empty-heading">Your bag is empty.</h1>
                                    <p>There is nothing in your bag. Let’s add some items.</p>
                                    <Link to="/" className="btn-fil-primary empty-cart-btn">Start Shopping</Link>
                                </div>
                                :
                                <div className="row">
                                    <ShoppingBagBlock />
                                    <CartSubTotalBlock checkoutText={this.state.checkoutText} />
                                </div>
                        }
                    </div>
                </div>
                {
                    !isMobile()
                    &&
                    <>
                        {empty === true && categories.length > 0 ? <ProductCategoriesBlock categories={categories} /> : <WishListProducts />}
                        <Footer />
                        {/* seoContent={meta_data} */}
                    </>
                }
            </div>
        );
    }
}

const mapStatesToProps = (state) => {
    return {
        components: { ...state.Home.components },
        status: state.Cart.status,
        compName: state.Cart.compName
    };
}

export default connect(mapStatesToProps, { getCart })(Shoppingbag);