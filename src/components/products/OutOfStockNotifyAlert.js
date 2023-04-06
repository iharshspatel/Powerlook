import React, { Component } from 'react';
import {ToastsStore} from 'react-toasts';
import {subscribeForStockAlert} from '../../actions/products';
import {isAuth} from '../../utilities';
import LoginModal from '../user/LoginModal';

class OutOfStockNotifyAlert extends Component {

  constructor(props){
    super(props);
    this.state = {
      processing: false,
      productId: props.productId
    };
  }

  clickHandler(e){
    e.preventDefault();
    const {productId, processing} = this.state;
    if(!isAuth()){
        window.getFooter().setState({
        renderElement: <LoginModal onHide={this.hideModal.bind(this)} />
      });

      return
    }
    if(processing === true)
      return null;

    this.setState({
      processing: true
    });

    subscribeForStockAlert(productId).then(response => {
      this.setState({
        processing: false
      });
      ToastsStore.success(response.data);
    }).catch(error => {
      this.setState({
        processing: false
      });
    })
  }

  hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
  }

  render() {
    const {processing} = this.state;

    return (
      <p>Notify me when the product will be in-stock  &nbsp;<button className={`btn btn-primary loading ${processing ? "show" : ""}`} onClick={this.clickHandler.bind(this)}>Notify</button></p>
    )
  }
}

export default OutOfStockNotifyAlert;