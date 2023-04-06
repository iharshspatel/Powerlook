import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {MEDIA_BASE} from '../constants';
import {getAttribute} from '../utilities';

class SubNavigation extends Component {

    constructor(props){
        super(props);

        this.state = {
            categories: []   
        };
    }

    componentWillMount(){
        const {categories, parentId} = this.props;
        this.setState({
            categories: categories.filter(cat => cat.parent_id == parentId)
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.categories.length != this.props.categories.length){
            const {categories, parentId} = nextProps;
            this.setState({
                categories: categories.filter(cat => cat.parent_id == parentId)
            });
        }
    }
    
    render() {
        let imgSrc = '';
        const {categories} = this.state;
        if(!categories.length)
            return null;

        return (
            <div className="subcategory">
                <ul>
                    {
                        categories.map(category => {
                            imgSrc = getAttribute(category, 'image');
                            return <li key={category.id}>
                                     <NavLink to={`/product-category/${category.url_path}`}>
                                        {
                                            typeof imgSrc !== 'undefined' && imgSrc.length > 0
                                            ?
                                            <i className="img"><img src={`${MEDIA_BASE}/catalog/category/${imgSrc}`} alt="" /></i>
                                            :
                                            ''
                                        }
                                        <span>{category.name}</span>
                                     </NavLink>
                                  </li>
                        })
                    }
                </ul>
             </div>
        );
    }
}

export default SubNavigation;
