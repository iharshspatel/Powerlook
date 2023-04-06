import React, { Component } from 'react';
import CompactRating from '../CompactRating';
import {dateFormat, isMobile} from '../../utilities';
import '../../jquery.bxslider.js';

class ReviewsAndRatingBlock extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: props.data,
      displayData: props.data.slice(0, 2),
      lessData: props.data.slice(0, 2)
    };
    this.slider = null;
    this.config = {
      speed: 500,
      slideMargin:0,
      shrinkItems: true,
      nextText: '',
      prevText: ''
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.data.length != this.state.data.length){
      this.setState({
        data: nextProps.data,
        displayData: nextProps.data.slice(0, 2),
        lessData: nextProps.data.slice(0, 2)
      });
    }
  }

  componentDidMount(){
    const $ = window.$$;
    //console.log(prevState.productUniqId != this.state.productUniqId, prevState.productUniqId, this.state.productUniqId);
    if ($('.review-photos').length > 0) {
      $.removeData($(".review-photos")[0], 'lightGallery');  
      $(".review-photos").lightGallery({
          download: false,
         thumbnail:true
      }); 
    }
  }

  showAll(){
    this.setState({
      displayData: this.state.data
    });
  }

  showLess(){
    this.setState({
      displayData: this.state.lessData
    });
  }

  render() {
    const {data, displayData} = this.state;

    return (
        <div className="comment-blocks">
           {
            displayData.map(item => {
              return <div className="list-ui-comment" key={item.review_id}>
                        <div className="user-comment">
                           <div className="rating-star">
                              <CompactRating overallRatingSummary={item.ratingSummary} overallReviewCounts='' />
                           </div>
                           <h3>{item.title}</h3>
                           <div className="comment-desc">
                              <p dangerouslySetInnerHTML={{__html: item.detail}}></p>
                           </div>
                           
                           <div className="block-comment-name">
                              <figure>
                                 <img src="/assets/images/user-avatar.png" alt="" />
                              </figure>
                              <figcaption>
                                 <span className="name">{item.nickname}</span>
                                 <time>{dateFormat(item.created_at, 'DD MMM, YYYY')}</time>
                              </figcaption>
                           </div>
                        </div>
                        {/*<div className="like-dislike-block-detail">
                           <ul>
                              <li>
                                 <a href="javascript:void(0);">
                                    <i className="icon-like-thumb"></i>
                                    <span>20</span>
                                 </a>
                              </li>
                              <li>
                                 <a href="javascript:void(0);">
                                    <i className="icon-dislike-thumb"></i>
                                    <span>3</span>
                                 </a>
                              </li>
                           </ul>
                        </div>*/}
                     </div>
            })
           }
           {
            data.length > 2
            ?
            (
              displayData.length < data.length
              ?
              <div className="block-link-review">
                <a href="javascript:void(0);" onClick={this.showAll.bind(this)}>
                   <span className="allcomment-text">All {data.length} Reviews</span>
                   <span className="less-text">show more</span>
                   <i className="icon-arrow-right"></i>
                </a>
              </div>
              :
              <div className="block-link-review">
                <a href="javascript:void(0);" onClick={this.showLess.bind(this)}>
                   <span className="allcomment-text">All {data.length} Reviews</span>
                   <span className="less-text">show less</span>
                   <i className="icon-arrow-left"></i>
                </a>
              </div>
            )
            :
            ''
           }
           
        </div>
    );
  }
}

export default ReviewsAndRatingBlock;
