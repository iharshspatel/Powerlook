import React, { Component } from 'react';

class LikeButton extends Component {

    constructor(props){
        super(props);

        this.bindScript = this.bindScript.bind(this);
    }

    componentWillMount(){
        window.addEventListener('load', this.bindScript);

        if(document.readyState === "complete" || document.readyState === "interactive"){
          this.bindScript();
        }
    }

    bindScript(){
        const $ = window.$$;

        $(this.refs.likeButton).on('click', function(){
            $(this).toggleClass('saved');
        });
    }

  render() {
    return (
      	<a href="javascript:void(0);" className="heart-btn save-option" ref="likeButton">
          <span className="icon-like"></span>
        </a>
    );
  }
}

export default LikeButton;
