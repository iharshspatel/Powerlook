import React, { Component } from "react";

class OrderStatusHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof this.state.data === "undefined" &&
      typeof nextProps.data === "undefined"
    ) {
      this.setState({
        data: nextProps.data,
      });
    }
  }

  render() {
    const { data } = this.props;

    return (
      <div className="track-status-v">
        {typeof data !== "undefined" ? (
          <ul>
            <li className="done checked">
              <span>Ordered</span>
            </li>
            {data == "canceled" ? (
              <li className="done cancelled checked">
                <span>Cancelled</span>
              </li>
            ) : (
              <>
                {data == "holded" && (
                  <li className="done checked">
                    <span>On Hold</span>
                  </li>
                )}
                <li
                  className={`done ${
                    data == "complete" ||
                    data == "dispatched" ||
                    data == "delivered" ||
                    data == "rejected_by_admin" ||
                    data == "undelivered"
                      ? "checked"
                      : ""
                  }`}
                >
                  <span>Pickup Generated</span>
                </li>
                <li
                  className={`done ${
                    data == "dispatched" ||
                    data == "delivered" ||
                    data == "rejected_by_admin" ||
                    data == "undelivered"
                      ? "checked"
                      : ""
                  }`}
                >
                  <span>Dispatched</span>
                </li>
                {data == "undelivered" || data == "rejected_by_admin" ? (
                  <li className="done cancelled checked">
                    <span>Undelivered</span>
                  </li>
                ) : (
                  <li
                    className={`done ${data == "delivered" ? "checked" : ""}`}
                  >
                    <span>Delivered</span>
                  </li>
                )}
              </>
            )}
          </ul>
        ) : (
          <ul>
            <li className="done">
              <span>Ordered</span>
            </li>
            <li className="done">
              <span>Pickup Generated</span>
            </li>
            <li className="done">
              <span>Dispatched</span>
            </li>
            <li className="done">
              <span>Delivered</span>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default OrderStatusHistory;
