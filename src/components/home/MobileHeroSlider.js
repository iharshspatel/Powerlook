import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import {MEDIA_BASE, SLIDERTYPE} from '../../constants';
import {fetchSlider, storeMobileHeroSliderInMemory} from '../../actions/home';
import '../../slick.js';
import '../../slick.css';

class MobileHeroSlider extends Component {

    constructor(props){
        super(props);
        this.state = {
            slides : props.slides,
            sliderId: null,
        };

        this._unMounted = false;
    }

    // componentDidMount(){

    //     const sliderId = this.props.data;
    //     if(!sliderId)
    //         return null;

    //     fetchSlider(sliderId).then(response => {
    //         if(!this._unMounted){
    //             this.setState({
    //                 slides: response.data,
    //                 sliderId
    //             });
    //             this.props.storeMobileHeroSliderInMemory(response.data);
    //         }
    //     });
    // }

    componentDidUpdate(){
        const $ = window.$$;

        if ($('.heroslider').length > 0 && !$('.heroslider.slick-initialized').length) {
            $('.heroslider').slick({
              dots: true,
              autoplay:true,
              autoplaySpeed:3000,
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: false,
              swipeToSlide: true,
              arrows :true,
              speed: 600,
              easing: 'ease',
              responsive: [
                {
                  breakpoint:991,
                  settings: {
                    slidesToShow:1,
                    slidesToScroll: 1,
                    arrows : false,
                  }
                }
              ]
            });
        }
    }

    componentWillUnmount () {
        this._unMounted = true;
    }

    render() {
        const {slides} = this.state;

        return (
            <div className="mob-hero-block">
                {
                    slides === null
                    ?
                    <Skeleton height={300} />
                    :
                    <ul className="heroslider">
                        {
                            slides.map((slide, index) => {
                                let link = null;
                                switch(slide.datatype){
                                    case SLIDERTYPE.CATEGORY:
                                        link = `/product-category/${slide.data_id}`;
                                        break;
                                    case SLIDERTYPE.PRODUCT:
                                        link = `/shop/${slide.categorslug}/${slide.data_id}`;
                                        break;
                                    case SLIDERTYPE.DISCOUNT:
                                        link = `/sales/${slide.data_id}`;
                                        break;

                                    default:
                                        link = slide.imagelink;
                                }

                                return <li key={slide.entity_id}>
                                            {
                                                link.match(/^http[s]{0,1}\:/) !== null
                                                ?
                                                <a title={slide.title} href={link}>
                                                    <img src={`${MEDIA_BASE}/${slide.mobile_imageurl}`} alt={slide.title} />
                                                </a>
                                                :
                                                <Link to={link}>
                                                    <img src={`${MEDIA_BASE}/${slide.mobile_imageurl}`} alt={slide.title} />
                                                </Link>
                                            }
                                        </li>
                            })
                        }                
                    </ul>
                }
            </div>
        );
  }
}

export default MobileHeroSlider;
