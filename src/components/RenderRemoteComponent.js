import React, { Component } from 'react';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      renderElement: null
    };
  }

  componentWillUpdate(){
    window.$$('body').removeClass('modal-open');
  	window.$$('.modal-backdrop').remove();
  }

  render() {
    const {renderElement} = this.state;
    
    return (
      <>
        {renderElement !== null && renderElement}
        {window.setFooter(this)}
      </>
    );
  }
}
