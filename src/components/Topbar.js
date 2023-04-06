import React, { Component } from 'react';
import { connect } from 'react-redux';
import {getTopBar} from '../actions/home';

class Topbar extends Component {
    constructor(props){
      super(props);
      this.state = {
        data: props.topbar,
        status: props.status
      };
    }

    componentWillMount(){
      this.props.getTopBar();
    }

    componentWillReceiveProps(nextProps){
      if(this.state.status != nextProps.status && nextProps.compName == 'topbar'){
        this.setState({
          data: nextProps.topbar
        });
      }
    }

    dismiss(e){
      this.setState({
        data: {...this.state.data, enabled: false}
      });
    }

    render() {
        const {data} = this.state;

        if(!data.enabled)
          return null;

        return (
            <div className="top-discount">
               <div className="container">
                  <a href={data.link && data.link.length > 0 ? data.link : 'javascript:void(0)'}>{data.content}</a>
                  <a href="javascript:void(0);" className="dismiss-offer" onClick={this.dismiss.bind(this)}>×</a>
               </div>
            </div>
        );
    }
}

const mapStatesToProps = (state) => {
    return {
        topbar: {...state.Home.topbar},
        status: state.Home.status,
        compName: state.Home.compName
    };
}

export default connect(mapStatesToProps, {getTopBar})(Topbar);
