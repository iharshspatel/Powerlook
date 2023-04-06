/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Component } from 'react';
import SizeChartTable from './SizeChartTable';
import Modal from '../Modal';

class SizeChartLink extends Component {

  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
  }

  openChart(e) {
    e.preventDefault();
    window.getFooter().setState({
      renderElement: <Modal
        id="size-chart-modal"
        dialogClass="modal-500"
        show={true}
        onHide={this.hideModal}
        header={<h5>Size Chart</h5>}
        body={<SizeChartTable size={this.props.size} onHide={this.hideModal} _this={this.props._this} attributes={this.props.attributes}
          isInStock={this.props.isInStock} data={this.props.data} callback={this.props.callback} />}
      />
    });
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null
    });
  }

  render() {
    return (
      <a href="javascript:void(0)" className="view-size-chart" onClick={this.openChart.bind(this)}>Size Chart</a>
    );
  }
}

export default SizeChartLink;
