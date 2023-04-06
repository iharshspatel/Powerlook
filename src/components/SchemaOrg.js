import React from 'react';
import {Helmet} from "react-helmet";
import JsonLd from './JsonLd';

export default class SchemaOrg extends React.Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		if(this.props.jsonLd){
			window.getFooter().setState({
		      	renderElement: <JsonLd data={this.props.jsonLd} />
		  	});
		}
	}
	render() {
		return null
	}
}