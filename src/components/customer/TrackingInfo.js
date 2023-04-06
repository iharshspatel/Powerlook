/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';

class TrackingInfo extends Component {
	render() {
		const { data } = this.props;

		if (typeof data.entity_id === 'undefined')
			return null;

		return (
			<>
				{
					data.tracking_link
						?
						<p>{data.title}, Tracking # {data.track_number} <a target="_blank" href={data.tracking_link}>Track Order</a></p>
						:
						<p>{data.title}, Tracking # {data.track_number}</p>
				}
			</>
		);
	}
}

export default TrackingInfo;
