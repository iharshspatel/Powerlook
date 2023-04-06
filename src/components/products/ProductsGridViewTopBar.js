/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
//import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb';
import CategoryName from './CategoryName';
import Dropdown from '../Dropdown';
import { connect } from 'react-redux';
import { sideFilter } from '../../actions/side_filter';
import { GetColorName } from 'hex-color-to-color-name';

class ProductsGridViewTopBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: props.products,
            parameters: []
        };
        if (this.props.location.search !== '') {
            this.setFilteredParams(this.props.location)
        }
    }

    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            this.setFilteredParams(location);
        });
    }

    setFilteredParams(location) {
        const spliD = location.search.split("?");
        const paramsD = spliD && spliD.length > 1 ? spliD[1].split("&") : null;
        if (paramsD && paramsD.length > 0) {
            const filteredData = localStorage.getItem('filteredData');
            if (filteredData) {
                const data = JSON.parse(filteredData);
                let d = [];
                paramsD.forEach(p => {
                    const [name, value] = p.split("=");
                    const b = data.find(d => d.code === name);
                    if (b) {
                        const valu = b.values.filter(v => value.split("%2C").includes(v.value));
                        if (valu && valu.length > 0) {
                            const vlaues = valu.map(cc => { return { 'name': name, 'value': cc.value, 'label': cc.label }; });
                            d = [...d, ...vlaues];
                        }
                    }

                });
                setTimeout(() => {
                    this.setState({
                        parameters: d
                    });
                }, 500)
            }
        } else {
            this.setState({
                parameters: []
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.products !== this.state.products) {
            this.setState({
                products: nextProps.products
            });
        }
    }

    componentWillUnmount() {
        this.unlisten();
    }

    sortProducts(e) {
        const { name, value } = e.target;
        const search = this.props.history.location.search.replace(/^\?/, '');
        const searchParams = new URLSearchParams(search);
        searchParams.set(name, value);
        // Update url params
        this.props.history.push({
            search: '?' + searchParams.toString()
        });
    }

    removeFilter(p) {
        this.props.sideFilter(p)
    }

    render() {
        const { products, parameters } = this.state;
        const { category, searchTerm, options } = this.props;

        return (
            <>
                {
                    typeof searchTerm === 'undefined' && category.match(/\:/)
                        ?
                        <Breadcrumb customClass="breadcrumb-ui" data={[{ link: `/product-category/${category.split(":")[0]}`, label: <CategoryName category={category.split(":")[0]} /> }, { label: <CategoryName category={category} /> }]} />
                        :
                        <Breadcrumb customClass="breadcrumb-ui" data={[{ label: typeof searchTerm === 'undefined' ? <CategoryName category={category} /> : searchTerm }]} />
                }
                <div className="productConHead">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 align-self-center">
                            <div className="left-product">
                                <h1>
                                    {
                                        typeof searchTerm === 'undefined'
                                            ?
                                            <CategoryName category={category} />
                                            :
                                            `Search results for: ${searchTerm}`
                                    }
                                    &nbsp;
                                </h1>
                                <span> {products !== null ? `${products.length} ${(products.length > 1 ? 'products' : 'product')}` : ''} </span>
                            </div>
                        </div>
                        <div className="col-md-7 col-sm-12 align-self-center text-right">
                            <div className="sort-block">
                                <label>Sort by:</label>
                                <div className="dropdown">
                                    <Dropdown name="sort" options={options} callback={this.sortProducts.bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='custom-filter'>
                        <ul>
                            {
                                parameters.map((p, i) => {
                                    return (
                                        <li key={p.label + i} className='cat-filter'>
                                            <div className='col align-self-center applied' key={p.label}>
                                                {
                                                    p.name === 'color' ?
                                                        <span className='shape' style={{ backgroundColor: p.label }}></span> : ''
                                                }
                                                {
                                                    p.name !== 'color' ? <span dangerouslySetInnerHTML={{ __html: p.label }}></span> :
                                                        <span>{GetColorName(p.label)}</span>
                                                }

                                                <button onClick={() => this.removeFilter(p)}>x</button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}

// export default connect(null, { sideFilter })(withRouter(ProductsGridViewTopBar))

export default withRouter(connect(null, { sideFilter })(ProductsGridViewTopBar));