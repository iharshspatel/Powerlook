import React, { Component } from "react";
import { connect } from "react-redux";
import OrdersListItem from "./OrdersListItem";
import {
  fetchOrdersList,
  saveOrdersListToMemory,
} from "../../actions/customer";
import OrderListItemSkeleton from "./OrderListItemSkeleton";
import Dropdown from "../Dropdown";
import InfiniteScroll from 'react-infinite-scroll-component';

class OrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: props.orders.length > 0 ? props.orders : null,
      sort: "",
      pageSize: 10,
      curPage: 1,
      hasMore: true,
      totalCount: 0
    };
  }

  componentWillMount() {
    const { sort, curPage, pageSize } = this.state;
    fetchOrdersList({ sort, curPage, pageSize }).then((response) => {
      this.setState({
        ...this.state,
        orders: response.data,
        hasMore: response.data[0].length < response.data[2].orderCount,
        totalCount: response.data[2].orderCount
      });
      this.props.saveOrdersListToMemory(response.data);
    });
  }

  sortOrdersList(e) {
    const { value } = e.target;
    this.setState({
      ...this.state,
      orders: null,
    });
    fetchOrdersList({ sort: value }).then((response) => {
      const orders = Object.assign([], this.state.orders)
      orders[0].push(...response.data[0])
      this.setState({
        ...this.state,
        orders,
        hasMore: orders.length < response.data[2].orderCount,
        totalCount: response.data[2].orderCount
      });
      this.props.saveOrdersListToMemory(response.data);
    });
  }

  fetchMoreData = (page = 1) => {
    if (this.state.orders[0].length === this.state.orders[2].orderCount) {
      this.setState({
        ...this.state,
        hasMore: false
      })
    } else {
      this.setState({
        ...this.state,
        curPage: page
      })
      fetchOrdersList({ sort: this.state.sort, curPage: page, pageSize: this.state.pageSize })
        .then((response) => {
          let orders = Object.assign({}, this.state.orders)
          if (orders) {
            orders[0].push(...response.data[0])
          } else {
            orders = response.data
          }
          this.setState({
            ...this.state,
            orders,
            hasMore: orders[0].length < response.data[2].orderCount,
            totalCount: response.data[2].orderCount
          });
          this.props.saveOrdersListToMemory(response.data);
        });
    }
  }

  render() {
    const { orders } = this.state;
    return (
      <div className="block-order-container">
        <div className="head-tabs">
          <h2>My Orders</h2>
          <div className="sort-block sort-right-block">
            <label>Filter by:</label>
            <div className="dropdown">
              <Dropdown
                options={{
                  all: "All Orders",
                  pending: "New Orders",
                  dispatched: "Dispatched Orders",
                  delivered: "Delivered Orders",
                  canceled: "Cancelled Orders",
                  holded: "On-Hold Orders",
                  pendingpayment: "Payment Pending Orders",
                  undelivered: "Undelivered Orders",
                }}
                name="orderSort"
                callback={this.sortOrdersList.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="block-order-container-list">
          {orders !== null && orders[0].length > 0 ? (
            <InfiniteScroll
              dataLength={orders[0].length}
              next={() => this.fetchMoreData(this.state.curPage + 1)}
              hasMore={this.state.hasMore}
              loader={<OrderListItemSkeleton count={2} />}
            >
              {
                orders[0].map((order, index) => (
                  <OrdersListItem
                    statuses={orders[1]}
                    key={order.entity_id}
                    order={order}
                  />
                ))
              }
            </InfiniteScroll>
          ) : orders === null ? (
            <OrderListItemSkeleton count={2} />
          ) : (
            <div className="no-record">No record found!</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => {
  return {
    orders: [...state.Customer.orders],
  };
};

export default connect(mapStatesToProps, { saveOrdersListToMemory })(
  OrdersList
);
