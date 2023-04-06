import React, { Component } from 'react';
import { connect } from 'react-redux';
import isSubset from 'is-subset/module/index';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { RESOLUTIONTYPE } from '../../constants';
import OrderListItemProduct from '../customer/OrderListItemProduct';
import QuantityBox from '../QuantityBox';
import Error from '../Error';
import ProductCustomAttributes from '../products/ProductCustomAttributes';

class RmaItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      exchangeItem: null,
      exchangeError: null,
      resolutionType: props.resolutionType,
      color: null,
      attributeIdValues: {},
      attributeIds: {}
    };

    this.updateReduxFormState = this.updateReduxFormState.bind(this);
  }

  componentWillMount() {
    const { product_options, product_attributes } = this.props.item;
    if (typeof product_attributes !== 'undefined') {
      product_attributes.map((attr, index) => {
        if (attr.code == 'color') {
          const color = typeof product_options[index] === 'undefined' ? '' : product_options[index].option_value;
          const attributeIdValues = { color };
          const attributeIds = { [attr.id]: color };
          this.setState({
            color,
            attributeIdValues,
            attributeIds
          })
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.resolutionType !== this.state.resolutionType) {
      this.setState({
        resolutionType: nextProps.resolutionType
      });
    }
  }

  updateProductVariation(attributes, options, attributeIds) {
    const { item_id } = this.props.item;
    const { color } = this.state;
    if (color !== null) {
      attributes = { ...attributes, color }
    }
    //console.log('this.props.item', this.props.item, attributes, attributeIds);
    if (options.length != Object.keys(attributes).length)
      return;

    const variations = this.props.item.variations.filter(item => {
      return isSubset(item, attributes);
    });

    if (typeof variations !== 'undefined' && variations.length > 0) {
      const isOutOfStock = !variations[0].in_stock || variations[0].is_salable == '0' || variations[0].is_salable === false;
      if (isOutOfStock) {
        this.setState({
          exchangeItem: null,
          exchangeError: "This variation is out of stock"
        });
        this.updateReduxFormState(item_id, '');
      } else {
        this.setState({
          exchangeItem: variations[0].sku,
          exchangeError: null
        });
        this.updateReduxFormState(item_id, variations[0].sku);
      }

    } else {
      this.setState({
        exchangeItem: null,
        exchangeError: "This variation is not available"
      });
      this.updateReduxFormState(item_id, '');
    }
  }

  updateReduxFormState(exchangeItemId, exchangeItemForSku) {
    const values = this.props._reduxForm.getValues();
    if (typeof values.exchange_item_for === 'undefined')
      this.props.change('exchange_item_for', { [exchangeItemId]: exchangeItemForSku });
    else
      this.props.change('exchange_item_for', { ...values.exchange_item_for, [exchangeItemId]: exchangeItemForSku });
  }

  render() {
    const { exchangeItem, exchangeError, resolutionType, attributeIds, attributeIdValues } = this.state;
    const { item, required, reasons } = this.props;
    return (
      <div className="tab-panel-ui">
        <div className="check-box-block">
          <label>
            <Field
              component="input"
              type="checkbox"
              name={`order_item${item.item_id}`}
              value={item.item_id}
              disabled={item.disabled}
              onChange={(e) => {
                const value = item.item_id;
                const { checked } = e.target;
                const values = this.props._reduxForm.getValues();
                this.setState({
                  checked,
                  exchangeItem: checked === true ? this.state.exchangeItem : null,
                  exchangeError: checked === true ? this.state.exchangeError : null
                });
                if (checked) {
                  // Set quantity to one
                  if (typeof values.return_item === 'undefined')
                    this.props.change('return_item', { [value]: 1 });
                  else
                    this.props.change('return_item', { ...values.return_item, [value]: 1 });

                  if (typeof values.item_checked === 'undefined')
                    this.props.change('item_checked', { [value]: value });
                  else {
                    this.props.change('item_checked', { ...values.item_checked, [value]: value });
                  }
                } else {
                  // Remove selected qty from payload
                  delete values.return_item[value];
                  this.props.change('return_item', { ...values.return_item });

                  // Remove order item from payload
                  delete values.item_checked[value];
                  this.props.change('item_checked', { ...values.item_checked });

                  // Remove exchange for item from payload
                  if (typeof values.exchange_item_for !== 'undefined') {
                    delete values.exchange_item_for[value];
                    this.props.change('exchange_item_for', { ...values.exchange_item_for });
                  }
                }

                return null;
              }}
            />
            <span className="check-ui"></span>
          </label>
        </div>
        <OrderListItemProduct item={item} />
        <div className="product-detail-right">
          {
            this.state.checked === true
            &&
            <div className="in">
              {
                resolutionType == RESOLUTIONTYPE.EXCHANGE
                &&
                <>
                  <p>Exchange it for {exchangeItem !== null ? `sku: ${exchangeItem}` : ""}</p>
                  {
                    Object.keys(item.product_attributes).length
                      ?
                      <ProductCustomAttributes size={item.product_options[1].value} hideAttrCode='color' attributeIds={attributeIds} attributeIdValues={attributeIdValues} variations={this.props.item.variations} itemId={item.item_id} options={item.product_attributes} onChange={this.updateProductVariation.bind(this)} />
                      :
                      ''
                  }
                  {
                    exchangeError !== null
                    &&
                    <Error text={exchangeError} />
                  }
                </>
              }
              <div className="m-t20">
                <QuantityBox
                  min={1}
                  max={item.qty_ordered}
                  smallBtn={true}
                  label="QUANTITY"
                  name="order_item_qty"
                  callback={(qty) => {
                    const value = item.item_id;
                    const values = this.props._reduxForm.getValues();
                    if (typeof values.return_item === 'undefined')
                      this.props.change('return_item', { [value]: qty });
                    else
                      this.props.change('return_item', { ...values.return_item, [value]: qty });
                    return null;
                  }}
                />
              </div>
              {
                Object.keys(reasons).length > 0
                &&
                <div className="select-box-ui">
                  <h5>Please tell the reason</h5>
                  <p>This information is only used to improve our service</p>
                  <div className="dropdown">
                    <select className="selectpicker style-select-block" onChange={
                      (e) => {
                        const reason = e.target.value;
                        const value = item.item_id;
                        const values = this.props._reduxForm.getValues();
                        if (reason == '') {
                          this.props.change('item_reason', {});
                          return null;
                        }
                        if (typeof values.item_reason === 'undefined')
                          this.props.change('item_reason', { [value]: reason });
                        else
                          this.props.change('item_reason', { ...values.item_reason, [value]: reason });
                        return null;
                      }
                    }>
                      <option value="">Select a reason</option>
                      {
                        Object.keys(reasons).map(key => {
                          return <option key={key} value={key}>{reasons[key]}</option>
                        })
                      }
                    </select>
                  </div>
                </div>
              }

            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    resolutionType: typeof state.form.rma_request.values !== 'undefined' ? state.form.rma_request.values.resolution_type : null
  }
}

export default connect(mapStatesToProps)(reduxForm({
  form: 'rma_request'
})(RmaItem))