import React, { Component } from 'react';
import '../../jquery.bxslider.js';
import {MEDIA_BASE} from '../../constants';
import {isMobile} from '../../utilities';

class StyleGallery extends Component {

  constructor(props){
    super(props);
    this.state = {
      images: this.findGalleryImages(props.images),
      productId: props.productId
    };
    this.loadSlider = this.loadSlider.bind(this);
    this.slider = null;
    this.config = {
      minSlides: 1,
      maxSlides: 5,
      slideWidth: 200,
      slideMargin: 30,
      infiniteLoop: false,
      moveSlides: 1,
      nextText: '',
      prevText: '',
    };
  }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.productId != this.state.productId){
  //     this.setState({
  //       images: this.findGalleryImages(nextProps.images),
  //       productId: nextProps.productId
  //     });
  //   }
  // }

  componentDidMount(){
      window.addEventListener('load', this.loadSlider);

      if(document.readyState === "complete" || document.readyState === "interactive"){
        this.state.images.length > 0 && this.loadSlider();
      }
  }

  componentDidUpdate(){
    const $ = window.$$;
    if ($(window).width() > 1025) {
      if(this.state.images.length > 0){
        this.loadSlider();
      }
    }
  }

  loadSlider(){
      const $ = window.$$;

      if (this.state.images.length > 0 && $('#style-lightgallery').length > 0) {
        //$.removeData($("#style-lightgallery")[0], 'lightGallery');  
        $("#style-lightgallery").lightGallery({
            download: false,
            thumbnail:true
        }); 
      }

      if ($(window).width() > 1025) {
          this.slider = $(this.refs.productSlider).bxSlider(this.config);
      }
  }

  findGalleryImages(images){
    if(!Object.keys(images).length)
      return [];

    return Object.keys(images).map(key => {
                     return typeof images[key]['styleimage_default'] !== 'undefined' && images[key]['styleimage_default'] == '1' ? images[key] : null; 
                  }).filter(value => {
                    return value !== null;
                  });
  }

  render() {
    let {images} = this.state;
    if(!images.length)
      return null;

    return (
        <div className="product-similar style-gallery-slider">
            <div className="heading-block">
               <div className="container">
                  <h2 data-aos="fade-up" data-aos-delay="100" className="aos-init aos-animate">Style Gallery</h2>
                  <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
               </div>
            </div>
            <div className="container">
             <div className="slider-product">
                <ul className="bxslider-product simlar-products" ref="productSlider" id="style-lightgallery">
                  {
                    images.map(image => {
                      return <li className="col-sm-4" data-aos="fade-up" key={image.value_id} data-src={`${MEDIA_BASE}/catalog/product/${image.file}`}>
                                <div className="product-ui-card" style={{cursor: 'zoom-in'}}>
                                  <div className="product-item">
                                      <figure>
                                          <img src={`${MEDIA_BASE}/catalog/product/${image.file}`} alt="" />
                                      </figure>
                                  </div>
                              </div>
                            </li>
                    })
                  }
                </ul>
             </div>
          </div>
        </div>
    );
  }
}

export default StyleGallery;
