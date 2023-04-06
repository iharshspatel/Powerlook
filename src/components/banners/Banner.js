import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { BANNER_CLICKED } from '../../constants';
import { load, trackwebEngageEvent } from '../../utilities';

class Banner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            components: [
                'NULL',
                'BannerLayout1',
                'BannerLayout2',
                'BannerLayout3',
                'BannerLayout4',
                'BannerLayout5',
                'BannerLayout6',
                'BannerLayout7',
            ]
        };
    }
    webEngageCallback(item) {
        const bannerObj = {
            "Banner Name": item.title,
            "Banner Category": item.imagelink.split('/').slice(-1)[0] || '',
            "url": item.imagelink
        }
        trackwebEngageEvent(BANNER_CLICKED, bannerObj);
    }

    render() {
        const { layout, images } = this.props;
        const BannerLayoutName = load('banners/' + this.state.components[layout || 'BannerLayout1']);

        return <BannerLayoutName images={images} webEngageCallback={this.webEngageCallback.bind(this)} />
    }
}

export default Banner;
