import React, { Component } from 'react';
import {NavLink, Link} from 'react-router-dom';

class Breadcrumb extends Component {

    render() {
        const {data, customClass} = this.props;
        
        return (
            <div className={typeof customClass !== 'undefined' ? customClass : 'breadcrumb-block'}>
                <ul>
                   <li>
                      <Link to="/">Home</Link>
                   </li>
                   {
                        data.map((item, index) => {
                            return <li key={index}>
                                      {
                                        typeof item.link === 'undefined'
                                        ?
                                        <span>{item.label}</span>
                                        :
                                        <Link to={item.link}>{item.label}</Link>
                                      }
                                      
                                   </li>
                        })
                   }
                   
                </ul>
             </div>
        );
    }
}

export default Breadcrumb;
