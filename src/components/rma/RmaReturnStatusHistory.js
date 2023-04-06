import React, { Component } from 'react';
import {RMASTATE} from '../../constants';

class RmaReturnStatusHistory extends Component {

  constructor(props){
    super(props)
    this.state = {
      data: props.data
    };
  }

  componentWillReceiveProps(nextProps){
    if(typeof this.state.data === 'undefined' && typeof nextProps.data === 'undefined'){
      this.setState({
        data: nextProps.data
      });
    }
  }

  render() {
    const {data} = this.props;

    return (
        <div className="track-status-v">
          {
            typeof data !== 'undefined'
            ?
            <ul>
               <li className="done checked">
                  <span>Return Requested</span>
               </li>
               {
                  data == RMASTATE[0].declined || data == RMASTATE[0].canceled
                  ?
                  (
                    data == RMASTATE[0].return_approved
                    ? 
                    <>
                      <li className="done checked"><span>Return in Transit</span></li>
                      {
                        data == RMASTATE[0].refund_initiated
                        ?
                        <li className="done checked"><span>Refund Processed</span></li>
                        :
                        <li className="done cancelled checked"><span>Declined</span></li>
                      }
                    </>
                    :
                    <li className="done cancelled checked"><span>{data == RMASTATE[1].declined ? 'Declined' : 'Canceled'}</span></li>
                  )
                  :
                  (
                    <>
                      <li className={`done ${data >= RMASTATE[0].return_approved ? "checked" : ''}`}><span>Return in Transit</span></li>
                      <li className={`done ${data == RMASTATE[0].refund_initiated ? "checked" : ''}`}><span>Refund Processed</span></li>
                    </>
                  )
              }
            </ul>
            : 
            <ul>
              <li className="done"><span>Return Requested</span></li>
              <li className="done"><span>Return in Transit</span></li>
              <li className="done"><span>Refund Processed</span></li>
            </ul>
          }
           
        </div>
    );
  }
}

export default RmaReturnStatusHistory;
