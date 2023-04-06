import React, { Component } from 'react';
import {connect} from 'react-redux'; 
import {Link, withRouter} from 'react-router-dom';
import CartPreview from '../cart/CartPreview';
import LoginModal from '../user/LoginModal';
import ProductSearch from '../ProductSearch';
import MobileMainNavigation from './MobileMainNavigation';
import {fetchCategoriesList, storeCategoriesList} from '../../actions/products';
import {getAttribute, isAuth} from '../../utilities';

class MobileHeader extends Component {

    constructor(props){
        super(props);
        this.state = {
            showSearch: false,
            showNav: false,
            status: props.status
        };

        this.toggleSearch = this.toggleSearch.bind(this);
        this.toggleNavigation = this.toggleNavigation.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.compName == 'auth' && nextProps.status != this.state.status){
            this.setState({
                status: nextProps.status
            });
        }
    }

    componentWillMount(){
        fetchCategoriesList().then(response => {
            response = JSON.parse(response.data);
            // Sort the categories by position set in admin
            response.items.sort((a, b) => {
                  return a.position - b.position;
            });
            response.items.map(item => {
                if(item.level > 1){
                    item['url_key'] = getAttribute(item, 'url_key');
                    item['url_path'] = getAttribute(item, 'url_path');
                }
                if(item.level == 2){
                    return item;
                }else{
                    return null;
                }
            });
            this.props.storeCategoriesList(response.items);
        });
    }

    toggleSearch(e){
        this.setState({
            showSearch: !this.state.showSearch
        });
    }

    toggleNavigation(e){
        this.setState({
            showNav: !this.state.showNav
        });
    }

    showModal(){
      window.getFooter().setState({
        renderElement: <LoginModal redirectTo={this.props.history.push} redirectUrl="/account/mywishlist" onHide={this.hideModal.bind(this)} />
      });
    }

    hideModal(){
      window.getFooter().setState({
          renderElement: null
      });
    }

    render() {
        const {showSearch, showNav} = this.state;

        return (
            <>
                {showNav && <MobileMainNavigation callback={this.toggleNavigation} />}
                <div className="header-mob">
                    <div className="mobile-left">
                        <a href="javascript:void(0)" className="sprites-hamburger" onClick={this.toggleNavigation}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </a>
                        <Link to="/" className="mob-logo">
                            <img src="/assets/images/mobile-logo.svg" width="34" height="34" alt="Powerlook" />
                        </Link>
                    </div>
                    <div className="mobile-right">
                        <CartPreview customclass="mobile-mBag"/>
                        {
                            isAuth()
                            ?
                            <Link className="mobile-mBag" to="/account/mywishlist">
                                <i className="ic"><img src="/assets/images/heart.svg" width="22" alt="Wishlist" /></i>
                            </Link>
                            :
                            <a className="mobile-mBag" href="javascript:void(0);" onClick={this.showModal.bind(this)}>
                                <i className="ic"><img src="/assets/images/heart.svg" width="22" alt="Wishlist" /></i>
                            </a>
                        }
                        
                        <a href="javascript:void(0);" className="mobile-mUser" onClick={this.toggleSearch}>
                            <span className="search-img icon-search"></span>
                        </a>
                        <a href="javascript:void(0);" className="mobile-mSearch"></a>
                    </div>
                </div>
                {
                    showSearch
                    &&
                    <div className="search-mob">
                        <div className="search-box-container">
                           <span className="icon-arrow-righ-v1 search-close" onClick={this.toggleSearch}></span>
                           <ProductSearch mobile={true} callback={this.toggleSearch} />
                        </div>
                    </div>
                }
            </>
        );
    }
}

const mapStatesToProps = (state) => {
    return {
        status: state.Auth.status,
        compName: state.Auth.compName,
    };
}

export default withRouter(connect(mapStatesToProps, {storeCategoriesList})(MobileHeader));
