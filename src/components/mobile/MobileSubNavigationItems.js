import React, { Component } from 'react';
import { MEDIA_BASE } from '../../constants';
import { getAttribute } from '../../utilities';

class MobileSubNavigationItems extends Component {


    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };

        this.navigate = this.navigate.bind(this);
    }

    componentWillMount() {
        const { categories, parentId, category } = this.props;
        this.setState({
            categories: categories.filter(cat => cat.parent_id == parentId),
            category
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.categories.length != this.props.categories.length) {
            const { categories, parentId } = nextProps;
            this.setState({
                categories: categories.filter(cat => cat.parent_id == parentId)
            });
        }
    }

    close() {
        this.props.callback();
        window.getFooter().setState({
            renderElement: null
        });
    }

    navigate(url_key) {
        this.props.history.push(`/product-category/${url_key}`);
        window.getFooter().setState({
            renderElement: null
        });
    }

    render() {
        let imgSrc = '';
        const { categories } = this.state;
        if (!categories.length) {
            this.navigate(this.props.url);
            return null;
        }

        return (
            <div className="mobileDrop-down active">
                <button className="closeSubNav-Btn" onClick={this.close.bind(this)}>×</button>
                <div className="mobileDrop-down-in">
                    <h5 className="title">{this.state.category.name}</h5>
                    <ul>
                        {
                            categories.map(category => {
                                imgSrc = getAttribute(category, 'image');
                                return <li key={category.id}>
                                    <a href="javascript:void(0);" onClick={() => this.navigate(category.url_path)}>
                                        {
                                            typeof imgSrc !== 'undefined' && imgSrc.length > 0
                                                ?
                                                <i className="img"><img src={`${MEDIA_BASE}/catalog/category/${imgSrc}`} alt="" /></i>
                                                :
                                                ''
                                        }
                                        <span>{category.name}</span>
                                    </a>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default MobileSubNavigationItems;
