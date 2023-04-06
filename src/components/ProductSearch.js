import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Autosuggest from 'react-autosuggest';
import {fetchSearchResults} from '../actions/products';
import {MEDIA_BASE} from '../constants';
import {getSessionItem, currencyFormat} from '../utilities';

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.title;

const renderSectionTitle = section => section.title;

const getSectionSuggestions = section => section.suggestions;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
  const user = getSessionItem('user');
  let price = null;
  if(typeof suggestion.price !== 'undefined'){
    price = user && typeof user.group_id !== 'undefined' ? suggestion.price[user.group_id] : suggestion.price[0];
  }
  return  <>
              { //suggestion.price
                typeof suggestion.image !== 'undefined'
                &&
                <figure className="img">
                  <img src={`${MEDIA_BASE}/catalog/product/${suggestion.image}`} alt={suggestion.title}/>
                </figure>
              }
              <div className="content">
                <h5>{suggestion.title}</h5>
                {
                  typeof suggestion.price !== 'undefined' 
                  && 
                  <div>
                    <div className="price-box price-final_price" data-role="priceBox" data-product-id="330" data-price-box="product-id-330">
                        {
                          price.is_discount
                          &&
                          <span className="special-price">
                              <span className="price-container price-final_price tax weee">
                                  <span className="price-label">Special Price</span>
                                  <span id="product-price-330" data-price-amount="299" data-price-type="finalPrice" className="price-wrapper ">
                                      <span className="price"> {currencyFormat(price.price, 'INR')}</span>
                                  </span>
                              </span>
                          </span>
                        }
                        <span className="old-price">
                          <span className="price-container price-final_price tax weee">
                            <span className="price-label">Regular Price</span>
                            <span id="old-price-330" data-price-amount="399" data-price-type="oldPrice" className="price-wrapper ">
                              <span className="price"> {currencyFormat(price.original_price, 'INR')}</span>
                            </span>
                          </span>
                        </span>
                    </div>
                  </div>
                }
              </div>
          </>
};

class ProductSearch extends Component {

  constructor() {
    super();

    this.state = {
      value: '',
      result: [],
      processing: false,
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  getListTitle(type){
    let title = '';

    switch(type){
      case 'product':
        title = 'Products';
        break;

      case 'category':
        title = 'Categories';
        break;
    }

    return title;
  }

  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
    this.setState({
      processing: false,
      suggestions: []
    });
    if(typeof this.props.callback !== 'undefined'){
      this.props.callback();
    }
    switch(suggestion.type){
      case 'product':
        this.props.history.push(`/shop/${suggestion.category}/${suggestion.url_key}`)
        break;

      case 'category':
        this.props.history.push(`/product-category/${suggestion.url}`)
        break;

      case 'term':
        this.props.history.push(`/catalog-search?searchTerm=${suggestion.title}`)
        break;
    }
  }

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    let result = [];
    if(value == this.state.value){
      this.setState({
        suggestions: [...this.state.result]
      });

      return;
    }

    this.setState({
      processing: true
    });

    fetchSearchResults(value).then(response => {
        response.data.map(item => {
          let flag = false;
          result = result.map((listItem, index) => {
            if(listItem.type == item.type){
              flag = true;
              return {...listItem, suggestions: [...listItem.suggestions, item]};
            }

            return listItem;
          });

          if(flag === false){
            result = [...result, {title: this.getListTitle(item.type), type: item.type, suggestions: [item]}]
          }
        });

        this.setState({
          result,
          processing: false,
          suggestions: result
        });
    })
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      processing: false,
      suggestions: []
    });
  };

  searchResult(e){
    if(e.which == 13) {
        this.props.history.push(`/pages/search?q=${escape(this.state.value)}`)
    }
  }

  render() {

    const { value, suggestions, processing } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search for products',
      value,
      onChange: this.onChange.bind(this),
      className: processing ? 'load show wizzy-search-input' : 'wizzy-search-input'
    };

    return (
      // <form method="GET" action="/pages/search" className='wizzy-search-form'>
        <Autosuggest
          multiSection={true}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          renderSectionTitle={renderSectionTitle}
          getSectionSuggestions = {getSectionSuggestions}
          onSuggestionSelected = {this.onSuggestionSelected.bind(this)}
          renderInputComponent = {(inputProps) => (
            <form action='/pages/search' method='GET' className='wizzy-search-form'>
              <div className="search-block">
                {
                  typeof this.props.mobile !== 'undefined'
                  ?
                  <input id="wizzy-search" autoFocus placeholder="Search for products" {...inputProps} />
                  :
                  <input id="wizzy-search" placeholder="Search for products" {...inputProps}  />
                }
                <span className="icon-search"></span>
            </div>
            </form>
          )}
        />
        // <button type='submit'></button>
      // </form>
    );
  }
}

export default withRouter(ProductSearch);
