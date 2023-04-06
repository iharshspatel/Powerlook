import React from 'react'
import SocialLogin from 'react-social-login'
 
const Button = ({ children, triggerLogin, ...props }) => (
  <a href="javascript:void(0)" onClick={triggerLogin} {...props}>
    { children }
  </a>
)
 
export default SocialLogin(Button)