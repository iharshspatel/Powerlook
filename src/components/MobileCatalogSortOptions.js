import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

class MobileCatalogSortOptions extends Component {

  constructor(props){
    super(props);

    this.sortProducts = this.sortProducts.bind(this);
  }

  componentDidMount(){
    const $ = window.$$;
    $('.modal-bottomOverlay').on('click',function(e) {
      
        if (!$(e.target).is('.filter-modal *,.filter-modal,.sort-mob-btn,.sort-mob-btn *,.filter-mob-btn,.filter-mob-btn *')) {
            $('.modal-bottom').removeClass('sortactive');
            $('body').removeClass('freezbody');
        }
    });
  }

  sortProducts(value){
    const $ = window.$$;
    const name = 'sort'
    const search = this.props.history.location.search.replace(/^\?/, '');
    const searchParams = new URLSearchParams(search);
    searchParams.set(name, value);
    // Update url params
    this.props.history.push({
      search: '?' + searchParams.toString()
    });

    // Remove filter options block
    $('.modal-bottom').removeClass('sortactive');
    $('body').removeClass('freezbody');
  }

  render() {
    const {options} = this.props;
    
    return (
        <div className="modal-bottom">
          <div className="modal-bottomOverlay"></div>
          <div className="filter-modal">
             <h3>Sort By</h3>
             <ul>
                {
                  Object.keys(options).map((key, index) => {
                    return (
                      <li key={index}>
                         <a href="javascript:void(0);" onClick={() => this.sortProducts(key)}>{options[key]}</a>
                      </li>
                    )
                  })
                }
                
             </ul>
          </div>
        </div>
    );
  }
}

export default withRouter(MobileCatalogSortOptions);
