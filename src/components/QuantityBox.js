import React, { Component } from 'react';

class QuantityBox extends Component {

    constructor(props){
        super(props);
        this.state = {
          value: typeof props.selected !== 'undefined' ? props.selected : props.min
        };

        this.decrease = this.decrease.bind(this);
        this.increase = this.increase.bind(this);
    }

    increase(){
        const {callback, max} = this.props;
        let {value} = this.state;

        if (value < max) {
          value++;
          this.setState({
            value
          });

          typeof callback !== 'undefined' && callback(value);
        }
    }

    decrease(){
        const {callback, min} = this.props;
        let {value} = this.state;

        if (value > 0) {
          if (value > min) {
            value--;
            this.setState({
              value
            });
            typeof callback !== 'undefined' && callback(value);
          }
        }
    }

    render() {
      const {min, max, label, smallBtn, xLeft, showInStock, name} = this.props;
      const {value} = this.state;
      const leftInStock = xLeft && parseInt(xLeft) >= max ? max : null;

      return (
        <div className="quanity-block">
           <div className="quantity-ui-fields">
              {
                typeof label !== 'undefined'
                &&
                <label>{label}</label>
              }
              <div id="field2" className={`quantity-input form-group quantity-v2 ${typeof smallBtn === 'undefined' ? "lg-quantity" : ''}`} ref="quantityBox">
                  <button type="button" id="sub2" className="quty-btn sub" onClick={this.decrease}>
                    <span className="icon-negative"></span>
                  </button>
                  <input name={typeof name === 'undefined' ? "qty" : name} type="number" id="2" value={value} min={min} max={max} />
                  <button type="button" id="add2" className="quty-btn add" onClick={this.increase}>
                    <span className="icon-postive"></span>
                  </button>
              </div>
              {typeof showInStock !== 'undefined' && showInStock === true && leftInStock && <div className="left-option">Only {leftInStock} Left!</div>}
           </div>
         </div>
          
      );
    }
}

export default QuantityBox;
