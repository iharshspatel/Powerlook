import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import {STARRATING} from '../constants';

class CompactRating extends Component {

  render() {

    const {overallRatingSummary, overallReviewCounts, onClick} = this.props;
    
    return (
        <>
          <div className="rating-outer"><StarRatings
            rating={overallRatingSummary}
            starRatedColor={STARRATING.color}
            numberOfStars={1}
            starDimension="12px"
            starSpacing="0"
            name='rating'
          /> {overallRatingSummary.toFixed(1)}</div> {overallReviewCounts && (typeof onClick !== 'undefined' ? <span className="star-counter" onClick={onClick}>({overallReviewCounts})</span> : <span className="star-counter">({overallReviewCounts})</span>)}
        </>
    );
  }
}

export default CompactRating;
