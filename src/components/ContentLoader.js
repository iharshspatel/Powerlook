import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Header from './Header';
import Footer from './Footer';

class ContentLoader extends Component {
  render() {
    return (
    	<div className="main-wrapper">
			
			<ReactLoading className="page-loader" type="spin" color="#E88A87" height={50} width={50} />
			
        </div>
    );
  }
}

export default ContentLoader;
