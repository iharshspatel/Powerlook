import React, { Component } from 'react';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import Banner from '../banners/Banner';
import {fetchBanner, storeAdsBlockInMemory} from '../../actions/home';

class BannersBlock extends Component {

    constructor(props){
        super(props);

        this.state = {
            images: props.images,
            index: props.index
        };

        this._unMounted = false;
    }

    // componentWillMount(){
    //     fetchBanner(this.props.bannerId).then(response => {
    //         if(!this._unMounted){
    //             this.setState({
    //                 images: response.data
    //             });
    //             this.props.storeAdsBlockInMemory(response.data, this.state.index);
    //         }
    //     });
    // }

    componentWillUnmount () {
        this._unMounted = true;
    }

    render() {
        const {images} = this.state;
        const {layoutId, title, subtitle} = this.props;
        const cnt = typeof images !== 'undefined' && images ? images.length : 0;
        return (
           <div className={`block-ad-ui ${cnt == 1 ? 'single-banner-ad' : ''}`}>
                {
                    title != '' || subtitle != ''
                    ?
                    <div className="heading-block">
                        <div className="container">
                            {title != '' && <h2 data-aos="fade-up" data-aos-delay="100">{title}</h2>}
                            {subtitle != '' && <p data-aos="fade-up" data-aos-delay="200">{subtitle}</p>}
                            <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                        </div>
                    </div>
                    :
                    ''
                }
            
                <Banner layout={layoutId} images={this.state.images} />
           </div> 
    );
  }
}

export default BannersBlock;
