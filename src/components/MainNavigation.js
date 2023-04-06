import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { connect } from 'react-redux';
import SubNavigation from './SubNavigation';
import MobileSubNavigationItems from './mobile/MobileSubNavigationItems';
import { getAttribute, isMobile } from '../utilities';
import { fetchCategoriesList, fetchProductsByCategoryId, storeCategoriesList } from '../actions/products';

class MainNavigation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: props.categories.filter(item => {
                return item.level == 2;
            })
        };

        this._unMounted = false;
        this.toggleMobileNav = this.toggleMobileNav.bind(this);
    }

    componentWillMount() {
        if (this.state.categories.length > 0)
            return;

        fetchCategoriesList().then(response => {
            response = JSON.parse(response.data);
            if (!this._unMounted && typeof response.items !== 'undefined') {
                // Sort the categories by position set in admin
                response.items.sort((a, b) => {
                    return a.position - b.position;
                });

                this.setState({
                    categories: response.items.map(item => {
                        if (item.level > 1) {
                            item['url_key'] = getAttribute(item, 'url_key');
                            item['url_path'] = getAttribute(item, 'url_path');
                        }
                        if (item.level == 2) {
                            return item;
                        } else {
                            return null;
                        }
                    }).filter(item => {
                        return item !== null;
                    })
                });

                this.props.storeCategoriesList(response.items);
            }
        });
    }

    componentWillUnmount() {
        this._unMounted = true;
    }

    async toggleMobileNav(url, parentId, category) {
        window.getFooter().setState({
            renderElement: <MobileSubNavigationItems history={this.props.history} category={category} callback={this.props.callback} categories={this.props.categories} parentId={parentId} url={url} />
        });
        if (typeof this.props.callback !== 'undefined')
            this.props.callback();
    }

    render() {
        const { categories } = this.state;

        return (
            <div className={this.props.customClassName}>
                <ul>
                    {
                        typeof this.props.mobile !== 'undefined' && !categories.length
                            ?
                            <>
                                <li style={{ padding: "10px 24px" }}><Skeleton width={100} height={16} /></li>
                                <li style={{ padding: "10px 24px" }}><Skeleton width={120} height={16} /></li>
                                <li style={{ padding: "10px 24px" }}><Skeleton width={100} height={16} /></li>
                                <li style={{ padding: "10px 24px" }}><Skeleton width={100} height={16} /></li>
                                <li style={{ padding: "10px 24px" }}><Skeleton width={150} height={16} /></li>
                                <li style={{ padding: "10px 24px" }}><Skeleton width={100} height={16} /></li>
                            </>
                            :
                            categories.map(category => {
                                return <li className="subNav" key={category.id}>
                                    {
                                        isMobile()
                                            ?
                                            <>
                                                <a href="javascript:void(0);" onClick={() => this.toggleMobileNav(category.url_key, category.id, category)}>{category.name}</a>
                                            </>
                                            :
                                            <>
                                                <NavLink activeClassName="active" to={`/product-category/${category.url_key}`}>{category.name}</NavLink>
                                                <SubNavigation categories={this.props.categories} parentId={category.id} />
                                            </>
                                    }
                                </li>
                            })
                    }

                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: [...state.Products.categories]
    }
}

export default withRouter(connect(mapStateToProps, { storeCategoriesList })(MainNavigation));
