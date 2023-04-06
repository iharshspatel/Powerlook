import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import {MEDIA_BASE, SLIDERTYPE} from '../../constants';
import {fetchSlider, storeWebHeroSliderInMemory} from '../../actions/home';

class HeroSlider extends Component {

    constructor(props){
        super(props);
        this.state = {
            slides : props.slides,
            sliderId: null,
        };

        //this.loadSlider = this.loadSlider.bind(this);
        //this.bindSlider = this.bindSlider.bind(this);
        this._unMounted = false;
    }

    componentDidMount(){
        // const sliderId = this.props.data;
        // if(!sliderId)
        //     return null;

        // fetchSlider(sliderId).then(response => {
        //     if(!this._unMounted){
        //         this.setState({
        //             slides: response.data,
        //             sliderId
        //         });
        //         this.props.storeWebHeroSliderInMemory(response.data);
        //     }
        //     //!this._unMounted && this.bindSlider();
        // });
    }

    // bindSlider(){
    //     // Don't load script if already loaded
    //     window.addEventListener('load', () => loadScript(this.loadSlider, 'bxslider', '/assets/js/jquery.bxslider.js'));

    //     if(document.readyState === "complete" || document.readyState === "interactive"){
    //       loadScript(this.loadSlider, 'bxslider', '/assets/js/jquery.bxslider.js');
    //     }
    // }

    componentWillUnmount () {
        this._unMounted = true;
    }

    // loadSlider(){
    //     window.$$(this.refs.heroSlider).bxSlider({
    //         nextText: '',
    //         prevText: '',
    //         infiniteLoop: false,
    //         hideControlOnEnd: true,
    //         auto: true,
    //         adaptiveHeight: false,
    //     });
    // }

    render() {
        const {slides} = this.state;
        //console.log('slides', slides);
        return (
            <div className="hero-section">

                {
                    slides === null
                    ?
                    <Skeleton height={463} />
                    :
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
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

                                    return <div className={`carousel-item ${!index ? "active" : ''}`} key={slide.entity_id}>
                                                {
                                                    link.match(/^http[s]{0,1}\:/) !== null
                                                    ?
                                                    <a title={slide.title} href={link}>
                                                        <img src={`${MEDIA_BASE}/${slide.imageurl}`} alt={slide.title} />
                                                    </a>
                                                    :
                                                    <Link to={link}>
                                                        <img src={`${MEDIA_BASE}/${slide.imageurl}`} alt={slide.title} />
                                                    </Link>
                                                }
                                                
                                            </div>
                                })
                            }

                            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon slick-arrow" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                <span className="carousel-control-next-icon slick-arrow" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                }
            </div>
    );
  }
}



export default HeroSlider;
