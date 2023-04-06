import React, { Component } from 'react';
import MobileSubNavigationItems from './MobileSubNavigationItems';

class MobileSubNavigation extends Component {

    constructor(props){
        super(props);
    }

    componentWillMount(){
        window.getFooter().setState({
            renderElement: <MobileSubNavigationItems />
        });
    }
    
    render() {
        return null
    }
}

export default MobileSubNavigation;
