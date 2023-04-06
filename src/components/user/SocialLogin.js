import React, {Component} from 'react';
import { connect } from 'react-redux';
import SocialButton from '../SocialButton';
import ContentLoader from '../ContentLoader';
import {socialLogin} from '../../actions/auth';
import {SOCIALFBID, SOCIALGOOGLEID} from '../../constants';

class SocialLogin extends Component {

    constructor(props){
      super(props);

      this.state = {
        showLoader: false
      };

      this.handleSocialLogin = this.handleSocialLogin.bind(this);
      this.handleSocialLoginFailure = this.handleSocialLoginFailure.bind(this);
    }

    handleSocialLogin(user){
      const {email, name, id} = user._profile;
      this.setState({
        showLoader: true
      });
      this.props.socialLogin({email, name, id, provider: user._provider}).then(response => {
        if(typeof this.props.redirectTo === 'undefined')
          return;

        const match = window.location.search.match(/redirectTo=(.*)/);
        if(match && match.length >=2 && match[1] != '' && match[1].match(/\/login/) === null){
          this.props.redirectTo(match[1]);
        }else{
          this.props.redirectTo('/');
        }
      });
    }
     
    handleSocialLoginFailure(err){
      console.error('ERROR',err);
    }

    render() {
        const {showLoader} = this.state;

        return (
            <>
              {showLoader && <ContentLoader />}
              <SocialButton
                provider='facebook'
                appId={SOCIALFBID}
                className="fb-btn"
                scope={['email']}
                onLoginSuccess={this.handleSocialLogin}
                onLoginFailure={this.handleSocialLoginFailure}
              >
              <img src="/assets/images/fb-white.svg" alt="" />

                <span> Login with Facebook</span>
              </SocialButton>
              <SocialButton
                provider='google'
                appId={SOCIALGOOGLEID}
                scope={['email']}
                className="google-btn"
                onLoginSuccess={this.handleSocialLogin}
                onLoginFailure={this.handleSocialLoginFailure}
              >
                <img src="/assets/images/google-icon.svg" alt="" />
                 <span> Login with Google</span>
              </SocialButton>
            </>
        );
    }
}

export default connect(null, {socialLogin})(SocialLogin);