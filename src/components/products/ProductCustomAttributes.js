import React, { Component } from 'react';
import isSubset from 'is-subset/module/index';
import { fetchConfigurableProductOptions } from '../../actions/products';
import SizeChartLink from './SizeChartLink';
import AddToCartButton from './AddToCartButton';
import OutOfStockNotifyAlert from './OutOfStockNotifyAlert';

class ProductCustomAttributes extends Component {

  constructor(props) {
    super(props);

    this.state = {
      options: typeof props.options !== 'undefined' ? props.options : {},
      status: null,
      sizeWidget: typeof props.sizeWidget !== 'undefined' ? props.sizeWidget : false,
      itemId: typeof props.itemId !== 'undefined' ? props.itemId : '',
      variations: typeof props.variations !== 'undefined' ? props.variations : [],
      attributes: [],
      attributeIds: {}
    };

    this.attributesStatus = [];
    this.selectedAttrs = props.attributeIdValues;
    this.selectedAttrIds = props.attributeIds;
    this.callback = this.callback.bind(this);
  }

  componentWillMount() {
    const { options, variations } = this.state;
    let attributes = [];
    let attributeIds = {};
    let tempAttributes = [];
    let colors = [];
    Object.keys(options).map(key => {
      tempAttributes = [];
      attributeIds[options[key].code] = options[key].id;

      if (attributes.length == 0) {
        options[key].values.map((attribute, index) => {
          attributes.push({ [options[key].code]: attribute.id });
        });

      } else {
        attributes.map((attr, index) => {
          options[key].values.map((attribute, index) => {
            tempAttributes.push({ ...attr, [options[key].code]: attribute.id });
          });
        });

        attributes = [...tempAttributes];
      }


      // if(options[key].code == 'color'){
      //   options[key].values.map((attribute, index) => {
      //     colors.push({[options[key].code]: attribute.id});
      //   });
      //   return;
      // }
      // colors.map(color => {
      //   options[key].values.map((attribute, index) => {
      //     attributes.push({...color, [options[key].code]: attribute.id});
      //   });
      // })
    });

    //console.log('attributes', attributes);

    attributes.map((attr, index) => {
      let product = variations.filter(item => {
        return isSubset(item, attr);
      });
      attributes[index]['inStock'] = product.length > 0 ? !(!product[0].in_stock || product[0].is_salable == '0' || product[0].is_salable === false) : false;
    });

    this.setState({
      attributes,
      attributeIds
    });

    //console.log(attributes);
  }

  // componentWillMount(){
  //     const {sku} = this.props;
  //     let requestCount = 0;
  //     fetchProductOptionsBySku(sku).then(response => {
  //       const options = response.data;
  //       options.map((option, index) => {
  //         fetchProductAttributesByOption(option.label).then(response => {
  //           const attrs = response.data;
  //           options[index].values = option.values.map(item => {
  //             return attrs.filter(attr => {
  //                 return attr.value == item.value_index;
  //               })[0];
  //           });
  //           if(options.length === ++requestCount){
  //               this.setState({
  //                   options
  //               });
  //           }
  //         });
  //       });
  //     });
  // }

  // componentWillMount(){
  //     const {productId} = this.props;
  //     if(Object.keys(this.state.options).length){
  //       return;
  //     }
  //     fetchConfigurableProductOptions(productId).then(response => {
  //       this.setState({
  //           options: response.data
  //       });
  //     });
  // }

  callback(e, attributeId, name) {
    const { value } = e.target;
    this.selectedAttrs = { ...this.selectedAttrs, [name]: value };
    this.selectedAttrIds = { ...this.selectedAttrIds, [attributeId]: value };
    // if(typeof this.selectedAttrs.size !== 'undefined' && !this.isInStock(this.state.attributes, name, value)){
    //   delete this.selectedAttrs.size;
    //   delete this.selectedAttrIds[this.state.attributeIds.size];
    // }
    //console.log(this.selectedAttrs, this.selectedAttrIds);

    this.props.onChange(this.selectedAttrs, this.state.options, this.selectedAttrIds, name);
    this.setState({
      status: new Date()
    });
    // Remove attribute error
    window.$$(`.${name}block`).parent().find('.error-text').remove();
  }

  isInStock(attributes, optionCode, optionValue, $this = this) {
    //console.log(attributes, optionCode, optionValue, $this.selectedAttrs);
    let product = attributes.filter(item => {
      return isSubset(item, { ...$this.selectedAttrs, [optionCode]: optionValue });
    });

    return product.length > 0 ? product[0].inStock : false;
  }

  removeOverlay() {
    const $ = window.$$;
    $('.sizePopup-mobile').removeClass('visible');
  }

  render() {
    const { options, status, itemId, attributes, sizeWidget } = this.state;
    let { hideAttrCode } = this.props;
    if (hideAttrCode !== 'undefined' && typeof hideAttrCode !== 'object') {
      hideAttrCode = [hideAttrCode];
    }
    if (!Object.keys(options).length)
      return null;

    return (
      <>
        {
          Object.keys(options).map(key => {
            const option = options[key];
            const optionCode = option.code.toLowerCase();
            return (
              <React.Fragment key={key}>
                {
                  typeof hideAttrCode !== 'undefined' && hideAttrCode.indexOf(optionCode) > -1
                    ?
                    ''
                    :
                    <>
                      <div className="sizeWrapper">
                        <div className={`attributes-block select-${optionCode}`} key={option.id}>
                          <h4 className="title-sm">Select {option.label}</h4>
                          {
                            typeof option.chart !== 'undefined' && typeof option.chart.points !== 'undefined'
                            &&
                            <SizeChartLink _this={this} data={option} size={this.props.size} attributes={attributes} isInStock={this.isInStock} callback={this.callback} />
                          }
                          {
                            sizeWidget === true && optionCode == 'size'
                              ?
                              <div className="sizePopup-mobile">
                                <div className="sizePopup-overlay" onClick={this.removeOverlay}></div>
                                <div className="popupBody">
                                  <div className="headerArea">
                                    <h4 className="title-sm">{option.label}</h4>
                                    {
                                      typeof option.chart !== 'undefined' && typeof option.chart.points !== 'undefined'
                                      &&
                                      <SizeChartLink _this={this} data={option} size={this.props.size} attributes={attributes} isInStock={this.isInStock} callback={this.callback} />
                                    }
                                  </div>
                                  <div className="contentArea">
                                    <div className="product-detail-right ">
                                      <div className="block-ui sizeblock">
                                        <ul>
                                          {
                                            option.values.map((attribute, index) => {
                                              return (
                                                optionCode == 'size'
                                                  ?
                                                  <li className={`${optionCode}-block-ui-v2 ${!this.isInStock(attributes, optionCode, attribute.id) ? 'out-of-stock' : ''}`} key={index}>
                                                    <label>
                                                      <input checked={typeof this.selectedAttrs !== 'undefined' && typeof this.selectedAttrs[optionCode] !== 'undefined' && this.selectedAttrs[optionCode] == attribute.id}
                                                        onChange={(e) => this.callback(e, option.id, optionCode)} defaultValue={attribute.id} type="radio" className="option-input" name={`${optionCode}${itemId}`} />
                                                      <span>{attribute.label}</span>
                                                    </label>
                                                  </li>
                                                  :
                                                  null
                                              )
                                            })
                                          }
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      {
                                        this.props.sku !== null && this.props.isOutOfStock
                                          ?
                                          <div className="outstock-block desktop-d-none">
                                            <h2>Out of Stock</h2>
                                            <OutOfStockNotifyAlert productId={this.props.productId} />
                                          </div>
                                          :
                                          <AddToCartButton type={this.props.type} variationSku={this.props.variationSku} entityId={this.props.productId} sku={this.props.sku} qty={this.props.qty} attributes={this.props.options} options={this.props.attributeIds} />
                                      }


                                    </div>
                                  </div>
                                </div>
                              </div>
                              :
                              ''
                          }

                        </div>
                        <div className={`block-ui ${optionCode}block`}>
                          <ul>
                            {
                              option.values.map((attribute, index) => {
                                return (
                                  optionCode == 'color'
                                    ?
                                    <li className="custom-checkbox-ui" key={index}>
                                      <label>
                                        <input checked={typeof this.selectedAttrs !== 'undefined' && typeof this.selectedAttrs[optionCode] !== 'undefined' && this.selectedAttrs[optionCode] == attribute.id} onChange={(e) => this.callback(e, option.id, optionCode)} type="radio" className="option-input" name={`color${itemId}`} defaultValue={attribute.id} />
                                        <div className="color-product-sign" style={{ backgroundColor: attribute.label }}></div>
                                      </label>
                                    </li>
                                    :
                                    <>
                                      {
                                        optionCode == 'size'
                                          ?
                                          <li className={`${optionCode}-block-ui-v2 ${!this.isInStock(attributes, optionCode, attribute.id) ? 'out-of-stock' : ''}`} key={index}>
                                            <label>
                                              <input
                                                checked={typeof this.selectedAttrs !== 'undefined' && typeof this.selectedAttrs[optionCode] !== 'undefined' && this.selectedAttrs[optionCode] == attribute.id}
                                                onChange={(e) => this.callback(e, option.id, optionCode)} defaultValue={attribute.id} type="radio" className="option-input"
                                                disabled={this.props.size === attribute.label}
                                              />
                                              <span>{attribute.label}</span>
                                            </label>
                                          </li>
                                          :
                                          <li className={`custom-radio-ui ${optionCode}-block-ui-v2 ${!this.isInStock(attributes, optionCode, attribute.id) ? 'out-of-stock' : ''}`} key={index}>
                                            <label>
                                              <input checked={typeof this.selectedAttrs !== 'undefined' && typeof this.selectedAttrs[optionCode] !== 'undefined' && this.selectedAttrs[optionCode] == attribute.id} onChange={(e) => this.callback(e, option.id, optionCode)} defaultValue={attribute.id} type="radio" className="option-input" name={`${optionCode}${itemId}`} />
                                              <span className="filter-input">{attribute.label}</span>
                                            </label>
                                          </li>
                                      }
                                    </>
                                )
                              })
                            }
                          </ul>
                        </div>
                      </div>
                    </>
                }
              </React.Fragment>
            )
          })
        }
      </>
    );
  }
}

export default ProductCustomAttributes;
