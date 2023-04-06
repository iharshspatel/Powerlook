import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {getAttribute} from '../utilities';
import {fetchCategoriesList, storeCategoriesList} from '../actions/products';

class CategoriesLinks extends Component {

    constructor(props){
        super(props);

        this.state = {
            categories: props.categories
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.categories.length != this.state.categories.length){
            this.setState({
                categories: nextProps.categories
            });
        }
    }

    render() {
        const {categories} = this.state;
        
        return (
            <div className={this.props.customClassName}>
                <ul>
                    {
                        categories.filter(item => {
                            return item.level == 2;
                        }).map(category => {
                            return <li key={category.id}>
                                        <NavLink activeClassName="active" to={`/product-category/${category.url_key}`}>{category.name}</NavLink>
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

export default connect(mapStateToProps, {storeCategoriesList})(CategoriesLinks);
