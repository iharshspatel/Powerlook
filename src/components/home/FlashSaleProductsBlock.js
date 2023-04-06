import React, { Component } from 'react';
import ProductsGridView from '../ProductsGridView';
import {fetchFlashSaleProducts} from '../../actions/products';
import {loadScript} from '../../utilities';

class FlashSaleProductsBlock extends Component {

    constructor(props){
        super(props);

        this.state = {
            saleEnd: false,
            products: props.products,
            id: props.id,
            saleInfo: props.sale,
            fullPage: typeof props.fullPage === 'undefined' ? false : true
        };

        this.loadScript = this.loadScript.bind(this);
        this._unMounted = false;
    }

    componentWillMount(){
        const {saleInfo} = this.state;
        if(typeof saleInfo !== 'undefined' && saleInfo){
          if((new Date(saleInfo['end_time']) + ' UTC') - (new Date()) < 0){
            this.setState({
              saleEnd: true
            });
          }
        }
    }

    componentDidUpdate(){
        const {products} = this.state;
        if(!products || !products.length)
          return null;
        window.addEventListener('load', () => loadScript(this.loadScript, 'timer', '/assets/js/jquery.time-to.min.js'));

        if(document.readyState === "complete" || document.readyState === "interactive"){
          loadScript(this.loadScript, 'timer', '/assets/js/jquery.time-to.min.js');
        }
    }

    componentWillUnmount () {
        this._unMounted = true;
    }

    componentWillReceiveProps(nextProps){
      if(this.state.products === null || (nextProps.products && this.state.products.length != nextProps.products.length)){
        this.setState({
          products: nextProps.products,
          saleInfo: nextProps.sale
        });
      }
    }

    //new Date('2012-11-29 17:00:34 UTC')
    loadScript(){
      const {saleInfo} = this.state;

      if((new Date(saleInfo['end_time']) + ' UTC') - (new Date()) < 0){
        window.$$(this.refs.flashSaleBlock).remove();
        return;
      }
      window.$$(this.refs.timer).timeTo({
        timeTo: new Date(new Date(saleInfo['end_time'] + ' UTC')),
        displayCaptions: true,
        displayDays: false,
        fontSize: 20,
        captionSize: 10,
        callback: () => {
          window.$$(this.refs.flashSaleBlock).remove();
        }
      });
    }

    render() {
        const {id, saleEnd, products, saleInfo, fullPage} = this.state;

        if(saleEnd || products === null || !products.length)
          return null;

        return (
            <div ref="flashSaleBlock" className="block-product-ui">
                <div className="heading-block head-sale">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <figcaption>
                                   <h2 data-aos="fade-up" data-aos-delay="100">
                                    <img src="/assets/images/flash.png" alt="" className="flash-icon" />{saleInfo['title']}
                                   </h2>
                                   <div className="sale-timing-container">
                                      <div className="sale-counter">
                                         <div ref="timer" id="timer-sale"></div>
                                      </div>
                                   </div>
                                   <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                                </figcaption>
                            </div>
                        </div>
                    </div>
                </div>
                {
                  fullPage
                  ?
                  <ProductsGridView products={products} />
                  :
                  <ProductsGridView col={3} products={products} moreProducts={`/flash-sale/${id}`} />
                }
                
            </div>
    );
  }
}

export default FlashSaleProductsBlock;
