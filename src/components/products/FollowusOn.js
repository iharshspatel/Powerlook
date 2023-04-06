import React, { Component } from 'react';
import {loadScript} from '../../utilities';

class FollowusOn extends Component {

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
        <div className="social-block-in">
          <strong>Follow us:</strong>
          <div className="addthis_inline_follow_toolbox_l3ni"></div>
        </div>
    );
  }
}


export default FollowusOn;
