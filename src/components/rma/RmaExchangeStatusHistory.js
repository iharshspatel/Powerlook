import React, { Component } from 'react';
import {RMASTATE} from '../../constants';

class RmaExchangeStatusHistory extends Component {

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
                  <span>Exchange Requested</span>
               </li>
               {

                  data == RMASTATE[1].declined || data == RMASTATE[1].canceled
                  ?
                  (
                    data == RMASTATE[1].exchange_approved
                    ? 
                    <>
                      <li className="done checked"><span>Exchange Approved</span></li>
                      {
                        data == RMASTATE[1].package_received
                        ?
                        <li className="done checked"><span>Package Received</span></li>
                        :
                        
                          data == RMASTATE[1].package_dispatched
                          ?
                          <li className="done checked"><span>Package Dispatched</span></li>
                          :
                          
                            data == RMASTATE[1].solved
                            ?
                            <li className="done checked"><span>Solved</span></li>
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
                      <li className={`done ${data >= RMASTATE[1].exchange_approved ? "checked" : ''}`}><span>Exchange Approved</span></li>
                      <li className={`done ${data >= RMASTATE[1].package_received ? "checked" : ''}`}><span>Package Received</span></li>
                      <li className={`done ${data >= RMASTATE[1].package_dispatched ? "checked" : ''}`}><span>Package Dispatched</span></li>
                      <li className={`done ${data == RMASTATE[1].solved ? "checked" : ''}`}><span>Solved</span></li>
                    </>
                  )
              }
            </ul>
            : 
            <ul>
              <li className="done"><span>Exchange Requested</span></li>
              <li className="done"><span>Exchange Approved</span></li>
              <li className="done"><span>Package Received</span></li>
              <li className="done"><span>Package Dispatched</span></li>
              <li className="done"><span>Solved</span></li>
            </ul>
          }
           
        </div>
    );
  }
}

export default RmaExchangeStatusHistory;
