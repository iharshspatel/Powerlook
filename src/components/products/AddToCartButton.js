import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastsStore } from "react-toasts";
import { withRouter, Link } from "react-router-dom";
import { addToCart, getCart } from "../../actions/cart";
import { isAuth, trackFBEvent } from "../../utilities";
import LoginModal from "../user/LoginModal";
import { MEDIA_BASE } from '../../constants'
class AddToCartButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entityId: props.entityId,
      sku: props.sku,
      qty: props.qty,
      options: props.options,
      attributes: props.attributes,
      type: props.type,
      processing: false,
      goToCart: false,
      product: props.product,
      discount: props.discount,
      category: props.match.params.category,
      selectedSize: props.selectedSize,
    };

    this.add = this.add.bind(this);
    this.quickBuy = this.quickBuy.bind(this);
    this.toggleProcessing = this.toggleProcessing.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.entityId != nextProps.entityId) {
      this.setState({
        entityId: nextProps.entityId,
        sku: nextProps.sku,
        qty: nextProps.qty,
        type: nextProps.type,
        options: nextProps.options,
        attributes: nextProps.attributes,
        goToCart: false,
      });
    } else {
      if (
        Object.keys(this.state.options).length !=
        Object.keys(nextProps.options).length
      ) {
        this.setState({
          options: nextProps.options,
          attributes: nextProps.attributes,
          goToCart: false,
        });
      }
    }
  }

  quickBuy(e) {
    e.preventDefault();
    if (!isAuth()) {
      window.getFooter().setState({
        renderElement: <LoginModal onHide={this.hideModal.bind(this)} />,
      });

      return;
    }

    this.add(e, true);
  }

  add(e, redirectUrl) {
    e.preventDefault();
    let imageArr = [];
    if (this.state.product.media_gallery) {
      const images = Object.values(this.state.product.media_gallery.images);
      imageArr = images.map(image => `${MEDIA_BASE}/catalog/product/${image.file}`)
    }
    const productDetail = {
      "Product ID": this.state.product.sku,
      "Product Name": this.state.product.name,
      "Category Name": this.state.category ? this.state.category : '',
      "Category ID": this.state.product.attribute_set_id,
      "Retail Price": Number(this.state.product.price),
      "Discount": this.state.discount ? this.state.discount : 0,
      "Price": Number(this.state.product.finalprice),
      "Currency": "INR",
      "Quantity": this.state.qty(),
      "Size": this.props.selectedSize ? this.props.selectedSize : '',
      "Stock": this.state.product.x_left ? this.state.product.x_left : 1,
      "Image": [imageArr[0]],
    };
    const { sku, qty, options, type, attributes } = this.state;
    if (this.state.processing === true) return null;

    // Validate Options
    if (!this.validate(attributes, options)) return null;

    const optionsArray = Object.keys(options);
    if (type == "configurable" && !optionsArray.length) {
      ToastsStore.error(
        "This is configurable product, please select required options."
      );
      return;
    }
    const itemOptions = optionsArray.map((optionId) => {
      return {
        option_id: optionId,
        option_value: options[optionId],
      };
    });
    // Create item payload to add it into the cart
    const payload = {
      cartItem: {
        sku,
        qty: qty(),
        product_option: {
          extension_attributes: {
            configurable_item_options: itemOptions,
          },
        },
      },
    };

    payload.productDetail = productDetail;

    const productItems = [];

    productItems.push({
      'item_id': this.state.product.sku,
      'item_name': this.state.product.name,
      'discount': this.state.discount ? this.state.discount : 0,
      'item_category': this.state.category ? this.state.category : '',
      'price': Number(this.state.product.finalprice),
      'quantity': this.state.qty()
    });

    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        'currency': "INR",
        'value': this.state.product.finalprice,
        'items': productItems
      });
    }

    // Disable the button
    this.toggleProcessing();
    // Add an item into the cart
    return addToCart(payload, this.props.cart)
      .then((response) => {
        window.$$("#dropdownMenuLink").addClass("shake-element");
        setTimeout(() => {
          window.$$("#dropdownMenuLink").removeClass("shake-element");
        }, 3000);
        ToastsStore.success("Product has been added in your shopping bag.");
        // Reload the cart
        this.props.getCart();
        trackFBEvent("AddToCart", {
          content_type: "product",
          content_ids: [payload.cartItem.sku],
          content_type: "product",
          contents: [
            { id: payload.cartItem.sku, quantity: payload.cartItem.qty },
          ],
        });
        if (typeof redirectUrl !== "undefined") {
          this.props.history.push("/checkout");
          return;
        }
        // Enable the button
        this.setState({
          processing: !this.state.processing,
          goToCart: true,
        });
      })
      .catch((error) => {
        // Enable the button
        this.toggleProcessing();
      });
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null,
    });
  }

  toggleProcessing() {
    this.setState({
      processing: !this.state.processing,
    });
  }

  validate(attributes, options) {
    const $ = window.$$;
    if (typeof attributes === "undefined") {
      return true;
    }

    Array.prototype.diff = function (a) {
      return this.filter(function (i) {
        return a.indexOf(i) < 0;
      });
    };

    const missingAttrs = Object.keys(attributes).diff(Object.keys(options));
    if (missingAttrs.length > 0) {
      // Shake the attributes
      missingAttrs.map((attr) => {
        $(`.${attributes[attr].code}block`).addClass("buzz");
        if (
          !$(`.${attributes[attr].code}block`).parent().find(".error-text")
            .length
        ) {
          $(`.${attributes[attr].code}block`)
            .parent()
            .append(
              '<div class="error-text">Please select ' +
              attributes[attr].label +
              "<div></div></div>"
            );
        }

        //console.log(`.select-${attributes[attr].code} .sizePopup-mobile`);
        if (
          $(`.select-${attributes[attr].code} .sizePopup-mobile`).length > 0
        ) {
          $(`.select-${attributes[attr].code} .sizePopup-mobile`).addClass(
            "visible"
          );
        }
      });
      // Remove the shake class
      setTimeout(() => $(".buzz").removeClass("buzz"), 1000);

      return false;
    }

    return true;
  }

  render() {
    const { processing, goToCart } = this.state;

    return goToCart ? (
      <Link to="/shopping-bag" className="btn-fil-primary addtobagbtn">
        VIEW BAG
      </Link>
    ) : typeof this.props.buyNow !== "undefined" &&
      this.props.buyNow === true ? (
      <a
        href="javascript:void(0)"
        className={`btn-fil-primary loading ${processing ? "show" : ""}`}
        onClick={this.quickBuy}
      >
        Buy Now
      </a>
    ) : (
      <a
        href="javascript:void(0);"
        className={`btn-fil-primary addtobagbtn btn-load loading ${processing ? "show" : ""
          }`}
        onClick={(e) => this.add(e)}
      >
        Add to Bag
      </a>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    cart: { ...state.Cart.cart },
  };
};

export default withRouter(
  connect(mapStatesToProps, { getCart })(AddToCartButton)
);
