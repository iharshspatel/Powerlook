import React, { Component } from 'react';
import { connect } from 'react-redux';

class CategoryName extends Component {

  constructor(props){
    super(props);

    this.state ={
      categories: props.categories
    };
  }

  componentWillReceiveProps(nextProps){
    if((this.state.categories === null || this.state.categories.length == 0) && nextProps.categories.length > 0){
      this.setState({
        categories: nextProps.categories
      });
    }else{
      if(this.props.category != nextProps.category){
        this.setState({
          categories: nextProps.categories
        });
      }
    }
  }

  getCategoryName(){
    const {categories} = this.state;

    const filter = categories.filter(item => {
      return item.url_path == this.props.category.replace(':', '/');
    });

    if(filter.length > 0)
      return filter[0].name;

    return this.props.category.replace(':', '/');
  }

  render() {

    return (
        <>
          {this.getCategoryName()}
        </>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    categories: [...state.Products.categories]
  }
}

export default connect(mapStateToProps)(CategoryName);
