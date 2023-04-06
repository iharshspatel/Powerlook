import React, { Component } from 'react';
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import Modal from '../Modal';
import ReviewRatingForm from './ReviewRatingForm';
import { isAuth, isMobile } from '../../utilities';
import LoginModal from '../user/LoginModal';
import ReviewsAndRatingBlock from './ReviewsAndRatingBlock';
import StarWiseRatingBlock from './StarWiseRatingBlock';
import { fetchReviews } from '../../actions/products';
import { STARRATING } from '../../constants';

class ReviewsAndRating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      productId: props.productId
    };

    this.hideModal = this.hideModal.bind(this);
  }

  // componentWillMount(){
  //   fetchReviews(this.state.productId).then(response => {
  //     this.setState({
  //       data: response.data
  //     });
  //   });
  // }

  //componentWillReceiveProps(nextProps){
  // if(nextProps.productId != this.state.productId){
  //   fetchReviews(nextProps.productId).then(response => {
  //     this.setState({
  //       data: response.data,
  //       productId: nextProps.productId
  //     });
  //   });
  // }
  //}

  showModal() {
    if (!isAuth()) {
      window.getFooter().setState({
        renderElement: <LoginModal onHide={this.hideModal.bind(this)} />
      });
    } else {
      window.getFooter().setState({
        renderElement: <Modal
          id="review-modal"
          show={true}
          onHide={this.hideModal}
          header={<h4>Write a Review</h4>}
          body={<ReviewRatingForm productId={this.state.productId} onHide={this.hideModal} />}
        />
      });
    }
  }

  hideModal() {
    window.getFooter().setState({
      renderElement: null
    });
  }

  render() {
    const { data } = this.state;
    if (data === null)
      return null;

    const overallRatingSummary = data[0] ? STARRATING.stars * data[0] / 100 : 0;
    return (

      <div className="rating-and-comments">
        <div className="container">
          <div className="row">
            {
              data[1]
              &&
              <div className="col-md-4 col-lg-3">
                <div className="buyer-rating">
                  <div className="buyer-head">
                    <div className="heading-block text-left">
                      <h4>Rate & Review</h4>
                      <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                    </div>
                    <div className="rating-count-wrapper">
                      <div className="rating-img">
                        <StarRatings
                          rating={overallRatingSummary}
                          starRatedColor={STARRATING.color}
                          numberOfStars={1}
                          starDimension="18px"
                          starSpacing="0"
                          name='rating'
                        /> <span>{overallRatingSummary.toFixed(1)}</span>
                      </div>
                      {
                        data[1]
                        &&
                        <div className="rating-info">
                          <a href="javascript:void(0);" className="reviews-block">{data[1]} Verified Buyer{parseInt(data[1]) > 1 ? 's' : ''} Rating</a>
                        </div>
                      }

                    </div>
                  </div>
                  {
                    typeof data[2] !== 'undefined'
                    &&
                    <StarWiseRatingBlock data={data[2]} totalUsers={data[1]} />
                  }
                  {
                    isMobile() && typeof data[3] !== 'undefined'
                    &&
                    <a href="javascript:void(0);" data-toggle="modal" data-target="#add-comment-block" className="btn-fil-primary" onClick={this.showModal.bind(this)}>WRITE A PRODUCT REVIEW</a>
                  }
                </div>
              </div>
            }

            <div className={`${data[1] ? 'col-lg-9' : 'col-lg-12'} col-md-8`}>
              {
                typeof data[3] !== 'undefined'
                  ?
                  <div className="customer-reviews-right">
                    <div className="heading-block text-left">
                      <div className="row">
                        <div className="col-sm-6">
                          <h3>Customer Reviews</h3>
                          <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                        </div>
                        {
                          !isMobile()
                          &&
                          <div className="col-sm-6 text-right">
                            <a href="javascript:void(0);" data-toggle="modal" data-target="#add-comment-block" className="btn-fil-primary" onClick={this.showModal.bind(this)}>WRITE A PRODUCT REVIEW</a>
                          </div>
                        }

                      </div>
                    </div>
                    <ReviewsAndRatingBlock data={data[3]} />
                  </div>
                  :
                  <div className="customer-review">
                    <h5 className="mb-26">There are no customer reviews yet.</h5>
                    <p className="m-0">Share your thoughts with other customers</p>
                    <div className="btn-block  visible no-review-btn">
                      <a href="javascript:void(0);" data-toggle="modal" data-target="#add-comment-block" className="btn-fil-primary" onClick={this.showModal.bind(this)}>Review Now</a>
                    </div>
                  </div>
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewsAndRating;
