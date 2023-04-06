import React, { Component } from 'react';
import SizeChartLink from './SizeChartLink';

class CustomAttribute extends Component {

  render() {
    const {option} = this.props;
    const optionCode = option.code.toLowerCase();

    return (
        <div className={`select-${optionCode}`} key={option.id}>
           <h4 className="title-sm">{option.label}</h4>
           <div className={`block-ui ${optionCode}block`}>
              <ul>
                {
                  option.values.map((attribute, index) => {
                    return (
                        optionCode == 'color'
                        ?
                        <li className="custom-checkbox-ui" key={index}>
                           <label>
                              <input onChange={(e) => this.callback(e, option.id)} type="radio" className="option-input" name="color" defaultValue={attribute.id} />
                              <div className="color-product-sign" style={{backgroundColor: attribute.label}}></div>
                           </label>
                        </li>
                        :
                        <li className={`${optionCode}-block-ui-v2`} key={index}>
                              <label>
                                 <input checked={typeof this.selectedAttrs[optionCode] !== 'undefined' && this.selectedAttrs[optionCode] == attribute.id} onChange={(e) => this.callback(e, option.id)} defaultValue={attribute.id} type="radio" className="option-input" name={optionCode} />
                                 <span>{attribute.label}</span>
                              </label>
                           </li>
                      )
                  })
                }
              </ul>
           </div>
           {
            typeof option.chart !== 'undefined' && typeof option.chart.points !== 'undefined'
            &&
            <SizeChartLink data={option} callback={this.callback} />
           }
        </div>
    );
  }
}

export default CustomAttribute;
