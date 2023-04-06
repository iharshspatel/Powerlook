import React, { Component } from 'react';
import {loadScript} from '../../utilities';

class AddThisButtons extends Component {

  constructor(props){
    super(props);
    this.state = {
      loaded: typeof window.addthis !== 'undefined' ? true : false
    };
    this.loadWidget = this.loadWidget.bind(this);
  }

  componentDidMount(){
    if(typeof window.addthis !== 'undefined' && typeof window.addthis.layers !== 'undefined'){
      window.addthis.layers.refresh();
      return;
    }
    window.addEventListener('load', () => loadScript(this.loadWidget, 'addthis', '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5dd277f20817e348'));
    if(document.readyState === "complete" || document.readyState === "interactive"){
      loadScript(this.loadWidget, 'addthis', '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5dd277f20817e348');
    }
  }

  loadWidget(){
    this.setState({
      loaded: true
    });
  }

  render() {
    const {loaded} = this.state;
    if(!loaded)
      return null;

    return (
        <div className="list-detail border-top">
          <h4 className="title-sm">Share on</h4>
          <div className="addthis_inline_share_toolbox detail-list"></div>
        </div>
    );
  }
}


export default AddThisButtons;
