import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {Link} from 'react-router-dom';
import {getCart} from '../../actions/cart';
import {isAuth} from '../../utilities';

class CartPreview extends Component {

    constructor(props){
        super(props);

        this.state = {
            cart: props.cart,
            status: props.status,
            authStatus: props.authStatus
        };
    }

    componentDidMount(){
        const {cart} = this.state;
        if(typeof cart.items === 'undefined'){
            // If there is no cart in memory
            this.props.getCart();
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.compName == 'cart' && this.state.status != nextProps.status){
            this.setState({
                cart: nextProps.cart,
                status: nextProps.status
            });
        }else{
            if(nextProps.authCompName == 'auth' 
              && 
              this.state.authStatus != nextProps.authStatus
              &&
              isAuth()
              ){
                this.setState({
                    authStatus: nextProps.authStatus
                });
                this.props.getCart();
            }
        }
    }

    getQuantity(items){
        let qty = 0;
        items.map(item => {
            qty += item.qty;
        });

        return qty;
    }

    render() {
        const {cart} = this.state;
        let linkclass = typeof this.props.customclass !=='undefined'?this.props.customclass:'dropdown-toggle';
        return (
            <Link to="/shopping-bag" className={linkclass} href="#" role="button" id="dropdownMenuLink">
                <span className="icon-cart1"></span>
                {
                    typeof cart.items !== 'undefined' && cart.items.length > 0
                    &&
                    <i className="value">{this.getQuantity(cart.items)}</i>
                }
            </Link>
        );
    }
}

const mapStatesToProps = (state) => {
    return {
        cart: {...state.Cart.cart},
        status: state.Cart.status,
        compName: state.Cart.compName,
        authStatus: state.Auth.status,
        authCompName: state.Auth.compName,
    };
}

export default connect(mapStatesToProps, {getCart})(CartPreview);
