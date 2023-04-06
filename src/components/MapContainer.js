import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {

	constructor(props){
		super(props);
		this.state = {
			bounds: []
		};
	}

	componentWillMount(){
		const {markers} = this.props;
		const bounds = new this.props.google.maps.LatLngBounds();
		for (let i = 0; i < markers.length; i++) {
		  bounds.extend({ lat: parseFloat(markers[i].latitude), lng: parseFloat(markers[i].longitude) });
		}

		this.setState({
			bounds
		});
	}

	componentDidMount(){
		setTimeout(() => {
			//window.map.panToBounds(this.state.bounds);
		}, 1000);
	}

	render() {
		const {markers, google} = this.props;
		
	    return (
	      	<Map google={google}
			    style={{width: '100%', height: '100%', position: 'relative'}}
			    className={'map'}
			    bounds={this.state.bounds}>
			  {
			  	markers.map(marker => {
			  		return <Marker
					  		key={marker.id}
						    title={marker.address}
						    name={marker.name}
						    position={{lat: marker.latitude, lng: marker.longitude}} 
						   />
			  	})
			  }
			</Map>
	    )
	}
}
 
export default GoogleApiWrapper({
  apiKey: "AIzaSyA1r4lhEqwZh6kxkMTVLPtIGByzeh5JQuA"
})(MapContainer)