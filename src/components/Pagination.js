import React, { Component } from 'react';

class Pagination extends Component {
  render() {
    return null;
    
    return (
      	<div className="row">
           <div className="pagination-ui text-center">
              <ul>
                 <li className="active">
                    <a href="javascript:void(0);">1</a>
                 </li>
                 <li>
                    <a href="javascript:void(0);">2</a>
                 </li>
                 <li>
                    <a href="javascript:void(0);">3</a>
                 </li>
                 <li>
                    <a href="javascript:void(0);">4</a>
                 </li>
                 <li>
                    <a href="javascript:void(0);">5</a>
                 </li>
                 <li>
                    <a href="javascript:void(0);">6</a>
                 </li>
                 <li className="next-pagination">
                    <a href="javascript:void(0);">
                       <span>Next</span>
                       <i className="icon-arrow-right"></i>
                    </a>
                 </li>
              </ul>
           </div>
        </div>
    );
  }
}

export default Pagination;
