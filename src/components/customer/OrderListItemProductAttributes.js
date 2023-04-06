import React, { Component } from 'react';

class OrderListItemProductAttributes extends Component {

  render() {
    const {attrs} = this.props;

    if(attrs.length == 0)
      return null;

    return (
      <>
      {
        attrs.map((attr, index) => {
          const value = isNaN(attr.value) ? (attr.value.match(/^\#[0-9a-z]{3,6}/i) ? <span className="color-product-sign little-color-swatch" style={{background: attr.value}}></span> : attr.value) : '';
          
          if(value == ''){
            return ''
          }  

          return <React.Fragment key={index}> <span>·</span> {attr.label} {value}</React.Fragment>
        })
      }
      </> 
    );
  }
}

export default OrderListItemProductAttributes;
