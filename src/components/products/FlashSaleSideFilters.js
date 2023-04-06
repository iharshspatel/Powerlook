import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {fetchFlashSaleFilterAttributes} from '../../actions/products';
import ProductsSideFilterSkeleton from '../ProductsSideFilterSkeleton';
import {isMobile} from '../../utilities';

class FlashSaleSideFilters extends Component {
	constructor(props){
		super(props);
	
		this.state = {
			filters: null,
			id: props.id,
			selection: props.filters,
			searchParams: null
		};

		this.filter = false;
		this.filterResults = this.filterResults.bind(this);
		this.filterMultipleResults = this.filterMultipleResults.bind(this);
		this.fetchProductsBySearchCriteria = this.fetchProductsBySearchCriteria.bind(this);

		this.unlisten = props.history.listen(this.fetchProductsBySearchCriteria);
	}

	componentWillMount(){
		if(this.state.filters !== null)
			return;
		fetchFlashSaleFilterAttributes(this.state.id, this.state.selection).then(response => {
			this.setState({
				filters: response.data
			});
		});
	}

	componentWillUnmount(){
		this.unlisten();
	}

	fetchProductsBySearchCriteria(location, action){
		const searchParams = new URLSearchParams(location.search);
	    let filters = {};
	    for(let pair of searchParams.entries()) {
		   filters = {...filters, [pair[0]]: pair[1]};
		}
	    if(Object.keys(filters).length > 0){
	    	this.props.fetchProductsByCategoryId(filters);
	    }
	}

	filterResults(e){
		const {name, value} = e.target;
		let {searchParams} = this.state;
		const search = this.props.history.location.search.replace(/^\?/, '');
		searchParams = searchParams === null ? new URLSearchParams(search) : searchParams;
		searchParams.set(name, value);
		//this.filter = true;
		// Update url params
		if(!isMobile()){
			this.props.history.push({
				search: '?' + searchParams.toString()
			});
		}
		this.setState({
			selection: {...this.state.selection, [name]: value},
			searchParams
		});
	}

	filterMultipleResults(e){
		let terms = [];
		const {name, value} = e.target;
		let {searchParams} = this.state;
		const search = this.props.history.location.search.replace(/^\?/, '');
		searchParams = searchParams === null ? new URLSearchParams(search) : searchParams;
		searchParams.delete(name);
		window.$$('#productSideFilters').find(`input[name=${name}]:checked`).each(function(item) {
			terms.push(window.$$(this).val());
		});

		if(terms.length > 0){
			searchParams.set(name, terms.join(','));
		}
		
		const searchParamsString = searchParams.toString();
		//Update url params
		if(!isMobile()){
			this.props.history.push({
				search: '?' + searchParamsString
			});
		}
		if(searchParamsString.length > 0){
			this.setState({
				selection: {...this.state.selection, [name]: terms.join(',')},
				searchParams
			});
		}else{
			this.resetFilters();	
		}
		
	}

	resetFilters(){
		let newSearchQuery = [];
		const search = this.props.history.location.search.replace(/^\?/, '');
		const searchParams = new URLSearchParams(search);
		const sort = searchParams.get('sort');
		const searchTerm = searchParams.get('searchTerm');
		//this.filter = true;
		// Update url params
		typeof sort !== 'undefined' && sort !== null && newSearchQuery.push('sort=' + sort);
		typeof searchTerm !== 'undefined' && searchTerm !== null && newSearchQuery.push('searchTerm=' + searchTerm);
		if(!isMobile()){
			this.props.history.push({
				search: newSearchQuery.length > 0 ? `?${newSearchQuery.join('&')}` : ''
			});
			if((typeof sort === 'undefined' || sort === null) && (typeof searchTerm === 'undefined' || searchTerm === null)){
				this.props.fetchProductsByCategoryId({});
			}
		}

		this.setState({
			selection: {},
			searchParams: new URLSearchParams('')
		});

		document.getElementById('productSideFilters').reset();
	}

	hideMobileFilter(e){
		e.preventDefault();
	    const $ = window.$$;
	    $('.aside-filter').removeClass('filteractive');
        $('body').removeClass('freezbody');
	}

	applyMobileFilter(e){
		e.preventDefault();
		const {searchParams} = this.state;
		//console.log('searchParams', searchParams.toString());
		if(searchParams !== null){
			this.props.history.push({
				search: '?' + searchParams.toString()
			});
			if(searchParams.toString().length == 0){
				this.props.fetchProductsByCategoryId({});
			}
			
		}

		this.hideMobileFilter(e);
	}

  render() {
  	const {id, filters, selection} = this.state;

    return (
        <aside className="col-sm-3 br-1 aside-filter">
	         <div className="filter-block sticky-filter">
	            <div className="head-filter">
	               <h2>Filters</h2>
	               <a href="javascript:void(0);" className="reset-filter" onClick={this.resetFilters.bind(this)}>Reset</a>
	            </div>
	            <form id="productSideFilters">
	            <div className="content-filter">
	            	{
	            		filters === null || typeof filters === 'undefined'
		            	?
		            	<ProductsSideFilterSkeleton count={2} />
		            	:
		            	<>
		            		{
			            		filters.map(filter => {
			            			const block = `${filter.code.toLowerCase()}block`;

			            			return (
			            				<div key={filter.code} className="filter-list-block">
						                  <div className="head-list-block">
						                     <h3>{filter.name}</h3>
						                  </div>
						                  <div className={`block-ui ${block}`}>
						                     <ul>
						                     	{
						                     		filter.values.map((item, index) => {
						                     			
						                     			let isChecked = 
						                     			typeof selection[filter.code] !== 'undefined' 
						                     			? 
						                     			(
						                     				selection[filter.code].split(',').includes((item.value).toString())
						                     			) 
						                     			: 
						                     			false;

						                     			return ( 
						                     				<li className={`${filter.input_type == 'multiple' ? "custom-checkbox-ui" : "custom-radio-ui"}`} key={index}>
									                           <label>
									                              <input checked={isChecked} onChange={(e) => filter.input_type == 'multiple' ? this.filterMultipleResults(e) : this.filterResults(e)} value={item.value} 
									                              	  type={filter.input_type == 'single' ? 'radio' : 'checkbox'} 
									                              	  className="option-input" 
									                              	  name={filter.code} />
									                              {
									                              	block == 'colorblock'
									                              	?
									                              	<div className="color-product-sign" style={{backgroundColor: item.label}}></div>
									                              	:
									                              	<>
									                              		<span className="filter-input" dangerouslySetInnerHTML={{__html: item.label}}></span>
									                              		{typeof item.count !== 'undefined' && <span className="item-count">({item.count})</span>}
									                              	</>
									                              }
									                              
									                           </label>
									                        </li>
						                     			)
						                     		})
						                     	}
						                     </ul>
						                  </div>
						               </div>
			            			)
			            		})
			            	}
		            	</>
	            	}
	            	
	               
	            </div>
	            </form>
	         </div>
	         <div className="action-filter">
                <button className="cancel-filter">Cancel</button>
                <button className="appyfilter">Apply</button>
             </div>
	         <div className="action-filter">
	            <button className="cancel-filter" onClick={this.hideMobileFilter}>Cancel</button>
	            <button className="appyfilter" onClick={this.applyMobileFilter.bind(this)}>Apply</button>
	         </div>
	    </aside>
    );
  }
}

export default withRouter(FlashSaleSideFilters);