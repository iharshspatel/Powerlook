import React, { Component } from 'react';
import {ToastsStore} from 'react-toasts';
import Error from '../Error';
import UploadImages from './UploadImages';
import {saveReview} from '../../actions/products';
import {MAXREVIEWIMAGES, REVIEWIMAGESIZE} from '../../constants';

class ReviewRatingForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      errors: null,
      productId: props.productId,
      processing: false,
      images: []
    };
    this.data = {rating: '', title: '', detail: ''};
    this.captureReviewImages = this.captureReviewImages.bind(this);
  }

  changeHanlder(e){
    const {name, value} = e.target;
    
    this.data = {...this.data, [name]: value};
  }

  captureReviewImages(images){
    this.setState({
      images
    });
  }

  submitHandler(e){
    e.preventDefault();
    if(this.state.processing === true){
      return;
    }
    let errors = {};
    const {images} = this.state;
    const {rating, title, detail} = this.data;

    if(rating == '')
      errors = {...errors, rating: 'Please select a rating'};
    if(title == '')
      errors = {...errors, title: 'Please enter review title'};
    if(detail == '')
      errors = {...errors, detail: 'Please enter review detail'};

    if(Object.keys(errors).length > 0){
      this.setState({
        errors,
        processing: false
      });
    }else{
      this.setState({
        processing: true
      });
      //console.log({rating, title, detail, images}); return;
      saveReview(this.state.productId, {rating, title, detail, images}).then(response => {
        ToastsStore.success('Your review has been submitted successfully.');
        this.props.onHide();
        this.setState({
          processing: false
        });
      });
    }
  }

  render() {
    const {errors, processing} = this.state;

    return (
        <div className="write-comment-block">
         <form ref="reviewForm" onChange={this.changeHanlder.bind(this)} onSubmit={this.submitHandler.bind(this)}>
         <div className="block">
            <label className="title">Overall rating</label>
            <div className="block-content-comment">
               <div className="star-rating-custom">
                 <input type="radio" id="5-stars" name="rating" value="5" />
                 <label htmlFor="5-stars" className="star" dangerouslySetInnerHTML={{__html: "&bigstar;"}}></label>
                 <input type="radio" id="4-stars" name="rating" value="4" />
                 <label htmlFor="4-stars" className="star" dangerouslySetInnerHTML={{__html: "&bigstar;"}}></label>
                 <input type="radio" id="3-stars" name="rating" value="3" />
                 <label htmlFor="3-stars" className="star" dangerouslySetInnerHTML={{__html: "&bigstar;"}}></label>
                 <input type="radio" id="2-stars" name="rating" value="2" />
                 <label htmlFor="2-stars" className="star" dangerouslySetInnerHTML={{__html: "&bigstar;"}}></label>
                 <input type="radio" id="1-star" name="rating" value="1" />
                 <label htmlFor="1-star" className="star" dangerouslySetInnerHTML={{__html: "&bigstar;"}}></label>
               </div>
            </div>
            {errors && typeof errors.rating !== 'undefined' && <Error text={errors.rating} />}
         </div>
         <UploadImages callback={this.captureReviewImages} maxUploads={MAXREVIEWIMAGES} maxSize={REVIEWIMAGESIZE} />
         <div className="block">
            <label className="title">Write your review</label>
            <div className="block-content-comment">
               <div className="write-review-content">
                  <fieldset>
                     <input name="title" type="text" className="text-field" placeholder="Review Title" />
                     {errors && typeof errors.title !== 'undefined' && <Error text={errors.title} />}
                  </fieldset>
                  <fieldset>
                     <textarea name="detail" className="text-field" placeholder="Description..."></textarea>
                     {errors && typeof errors.detail !== 'undefined' && <Error text={errors.detail} />}
                  </fieldset>
               </div>
            </div>
         </div>
         <div className="btn-block">
            <input type="submit" value="Submit Review" className={`border-btn-primary load ${processing === true ? "show" : ""}`} />
         </div>
         </form>
      </div>
    );
  }
}

export default ReviewRatingForm;
