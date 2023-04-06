import React, { Component } from 'react';
import {loadScript} from '../utilities';

class Dropdown extends Component {

  constructor(props){
    super(props);

    this.state = {
      options: props.options,
      name: props.name
    };

    this.loaded = false;
    this.loadScript = this.loadScript.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.options.length !== this.state.options.length){
      this.setState({
        options: nextProps.options
      });
    }
  }

  componentDidMount(){
    window.addEventListener('load', () => loadScript(this.loadScript, 'select-dropdown', '/assets/js/bootstrap-select.min.js'));

    if(document.readyState === "complete" || document.readyState === "interactive"){
      loadScript(this.loadScript, 'select-dropdown', '/assets/js/bootstrap-select.min.js');
    }
  }

  loadScript(){
      if(this.loaded === true)
        return;
      this.loaded = true;
      window.$$(this.refs.selectpicker).selectpicker();
      window.$$(this.refs.selectpicker).on("change", (e) => {
        if(typeof this.props.callback !== 'undefined'){
          this.props.callback(e);
        }
      });
  }

  render() {
    const {options, name} = this.state;

    return (
        <select name={name} ref="selectpicker" className="selectpicker style-select-block">
          {
            Object.keys(options).map((key, index) => {
              return <option key={index} value={key}>{options[key]}</option>
            })
          }
        </select>
    );
  }
}

export default Dropdown;