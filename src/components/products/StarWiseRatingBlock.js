import React, { Component } from 'react';

class StarWiseRatingBlock extends Component {

  render() {
    const {data, totalUsers} = this.props;

    return (
        <div className="list-rating">
           <ul>
              {
                [5, 4, 3, 2, 1].map(star => {
                  return <li key={star} className={`rate-${star}`}>
                           <div className="rating-no-left">
                              <span>{star}</span>
                              <i className="icon-ic_star"></i>
                           </div>
                           <div className="raging--status--progress">
                              <span style={{width: (data[star] > 0 ? ( data[star] * 100 / totalUsers ) + '%' : 0)}}></span>
                           </div>
                           <div className="counter-rating">{data[star]}</div>
                        </li>
                })
              }
           </ul>
        </div>
    );
  }
}

export default StarWiseRatingBlock;
