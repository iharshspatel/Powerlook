import React, { Component } from 'react';
import {ToastsStore} from 'react-toasts';
import {isAuth} from '../../utilities';
import {RESOLUTIONTYPE} from '../../constants';
import {fetchRmaDetail, cancelRmaItem, cancelRma} from '../../actions/rma';
import Breadcrumb from '../Breadcrumb';
import Header from '../Header';
import FooterBottomSection from '../FooterBottomSection';
import OrderListItemProduct from '../customer/OrderListItemProduct';
import OrderListItemProductSkeleton from  '../customer/OrderListItemProductSkeleton';
import RmaExchangeStatusHistory from './RmaExchangeStatusHistory';
import RmaReturnStatusHistory from './RmaReturnStatusHistory';
import RmaConversation from './RmaConversation';
import ExtraFieldsDetail from './ExtraFieldsDetail';

class ViewRmaDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      rma: {},
      id: props.match.params.rmaId
    };

    this.cancelRmaItem = this.cancelRmaItem.bind(this);
  }

  componentWillMount(){
    if(!isAuth()){
      this.props.history.push(`/login?redirectTo=${window.location.pathname}`);
    }

    fetchRmaDetail(this.state.id).then(response => {
      this.setState({
        rma: response.data[0]
      });
    });
  }

  cancelRmaItem(item_id){
    cancelRmaItem(item_id, this.state.id).then(response => {
      fetchRmaDetail(this.state.id).then(response => {
        this.setState({
          rma: response.data[0]
        });
        ToastsStore.success('Return item has been cancelled successfully.');
      });
    });
  }

  cancelRma(){
    if(window.confirm('Are you sure to cancel your return request?')){
      cancelRma(this.state.id).then(response => {
        ToastsStore.success('Your return request has been cancelled successfully.');
        this.props.history.push('/account/returns');
      });
    }
  }

  render() {
    const {rma, id} = this.state;

    return (
        <div className="main-wrapper">
            <Header />
            <div className="track-order-container">
              <div className="container">
                 <Breadcrumb data={[{link: '/account', label: 'My Account'}, {link: '/account/returns', label: 'Returns / Exchange'}, {label: `ID ${id}`}]} />
                 <div className="trackorder-block-v">
                    <div className="row">
                       <div className="col-xs-12 col-md-8 rma-detail">
                          {
                            typeof rma.items !== 'undefined'
                            ?
                            rma.items.map(item => {
                                return <OrderListItemProduct item={item} key={item.item_id} cancelCallback={() => this.cancelRmaItem(item.item_id)} />
                            })
                            :
                            <OrderListItemProductSkeleton count={1} />
                          }
                          
                          <div className="tracking-section-v" style={{padding: "24px 50px"}}>
                              <div className="tracking-head-v">
                                  <h3>Tracking</h3>
                              </div> 
                             {
                              rma.resolution_type == RESOLUTIONTYPE.EXCHANGE
                              ?
                              <RmaExchangeStatusHistory data={rma.admin_status} />
                              :
                              <RmaReturnStatusHistory data={rma.admin_status} />
                             }                             
                          </div>
                          <ExtraFieldsDetail data={rma} />
                          {
                            typeof rma.is_cancelable !== 'undefined' && rma.is_cancelable === true
                            &&
                            <div className="p-t40"> 
                              <a onClick={this.cancelRma.bind(this)} href="javascript:void(0);" className={`btn-fil-primary loading`}>Cancel Request</a>
                            </div>
                          }
                       </div>
                       <div className="col-md-4">
                         {/*<RmaConversation id={id} data={rma.conversation} />*/}
                      </div>
                    </div>
                 </div>
              </div>
           </div>
            <FooterBottomSection />
        </div>
    );
  }
}

export default ViewRmaDetail;
