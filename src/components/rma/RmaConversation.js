import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import {dateFormat} from '../../utilities';
import {updateRma} from '../../actions/rma';

class RmaConversation extends Component {

  constructor(props){
    super(props)
    this.state = {
      data: props.data,
      id: props.id,
      processing: false
    };
  }

  componentWillReceiveProps(nextProps){
    if(typeof this.state.data === 'undefined' && typeof nextProps.data !== 'undefined'){
      this.setState({
        data: nextProps.data,
        id: nextProps.id
      });
    }
  }

  postRmaMessage(e){
    e.preventDefault();
    const {processing, data} = this.state;
    if(processing === true)
      return false;

    const {attachment, message} = this.refs;
    const formData = new FormData();
    this.setState({
      processing: true
    });
    if(typeof attachment.files !== 'undefined' && attachment.files.length > 0)
      formData.append('attachment', attachment.files[0]);
    if(message.value.replace(/\s/, '') != ''){
      formData.append('message', message.value);
      updateRma(this.state.id, formData).then(response => {
        message.value = '';
        attachment.value = '';
        // Scroll the message thread to botton
        window.$$('.message-thread').scrollTop(999999);
        // update message thread with new message
        this.setState({
          data: [...data, response.data[0]],
          processing: false
        });
      }).catch(error => {
        this.setState({
          processing: false
        });
      });
    }
  }

  render() {
    const {data, processing} = this.state;

    return (
        <div className="conversation-wrapper">
          <div className="title">
             <h6>Conversation</h6>
          </div>

          <div className="message-box">
            <div className="message-thread">
              {
                typeof data !== 'undefined'
                ?
                data.map(convs => {
                  return <div key={convs.id} className="message">
                            <div className="name">
                               <h6>{convs.sender}</h6>
                               <span className="date">{dateFormat(convs.sent_on, 'lll')}</span>
                            </div>
                            <div dangerouslySetInnerHTML={{__html: convs.message}}></div>
                            {
                              convs.attachment != '' 
                              && 
                              <div className="message-attachment">
                                <a href={convs.attachment} title="Download">Download</a>
                              </div>
                            }
                         </div>
                })
                :
                <div className="message">
                    <div className="name">
                       <Skeleton width={180} height={21} />
                    </div>
                    <Skeleton width={320} height={13} />
                    <Skeleton width={320} height={13} />
                 </div>
              }
            </div>
             <div className="chat-input-wrapper">
                <div className="position-relative">
                    <div className="chat-input-field">
                      <input disabled={processing === true ? true : false} ref="message" name="message" className="field" type="text" placeholder="Type a message here…" />
                    </div>
                    <button className={`msg-send-btn loading ${processing === true ? "show" : ""}`} onClick={this.postRmaMessage.bind(this)}>
                      {
                        processing === false
                        &&
                        <i className="Send">
                          <img src="/assets/images/send.svg" alt="Send" />
                        </i>
                      }
                    </button>
                </div>
                <div className="attachment-ic">
                  <input ref="attachment" type="file" name="attachment" />
                   Attach file
                </div>
             </div>

          </div>
       </div>
    )
  }
}

export default RmaConversation;
