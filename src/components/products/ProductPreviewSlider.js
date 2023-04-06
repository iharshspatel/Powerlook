import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { MEDIA_BASE } from '../../constants';
import { isMobile } from '../../utilities';
import '../../jquery.bxslider.js';

class ProductPreviewSlider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      media: typeof props.media === 'undefined' ? null : props.media,
      entityId: props.entityId,
      productUniqId: props.productUniqId
    };
    this.slider = null;
    this.config = {
      speed: 500,
      slideMargin: 0,
      shrinkItems: true,
      nextText: '',
      prevText: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if ((this.state.media !== null && typeof nextProps.media === 'undefined') || typeof nextProps.entityId === 'undefined') {
      this.setState({
        media: null
      });

      return;
    }

    if ((this.state.media === null && nextProps.media !== null) || (this.state.entityId != nextProps.entityId)) {
      this.setState({
        media: typeof nextProps.media.images === 'undefined' ? [] : Object.values(nextProps.media.images),
        entityId: nextProps.entityId,
        productUniqId: nextProps.productUniqId
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { media } = this.state;
    const $ = window.$$;
    //console.log(prevState.productUniqId != this.state.productUniqId, prevState.productUniqId, this.state.productUniqId);
    if (media !== null && prevState.productUniqId != this.state.productUniqId && $('#lightgallery').length > 0) {
      $.removeData($("#lightgallery")[0], 'lightGallery');
      $("#lightgallery").lightGallery({
        download: false,
        thumbnail: true
      });
      if (isMobile()) {
        if (this.slider !== null) {
          this.slider.reloadSlider(this.config);
        } else {
          this.slider = $("#lightgallery").bxSlider(this.config);
        }
      }
    }
  }

  render() {
    let { media, entityId } = this.state;

    if (media === null) {
      return <ul className="product-main-slider">
        <li>
          <Skeleton width={331} height={405} />
        </li>
        <li>
          <Skeleton width={331} height={405} />
        </li>
        <li>
          <Skeleton width={331} height={405} />
        </li>
        <li>
          <Skeleton width={331} height={405} />
        </li>
      </ul>
    }

    media = media.filter((item) => {
      return item.styleimage_default === 'undefined' || item.styleimage_default != '1'
    });
    return (
      <ul className={`product-main-slider ${media.length > 1 ? '' : 'single'}`} id="lightgallery">
        {
          media.length > 0
            ?
            media.map(item => {
              return <li data-src={`${MEDIA_BASE}/catalog/product/${item.file}`} key={item.value_id}>
                <div className="img-ui">
                  <img src={`${MEDIA_BASE}/catalog/product/${item.file}`} alt={`${item.label_default}`} />
                </div>
              </li>
            })
            :
            <li data-src={`/assets/images/no-image.png`}>
              <div className="img-ui">
                <img src={`/assets/images/no-image.png`} alt="No Image" />
              </div>
            </li>
        }

      </ul>
    );
  }
}

export default ProductPreviewSlider;
