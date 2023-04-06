import React from 'react';
import ReactDOM from 'react-dom';
import { Provider  } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Recaptcha from 'react-google-invisible-recaptcha';

const __CAPTCHA_KEY__ = process.env.GOOGLE_CAPTCHA_KEY || "6LffQ70fAAAAABpklyq1gG39LNXXVMHbSjhH2SuC";

ReactDOM.render(
  <Provider store={store}>
  	<PersistGate loading={null} persistor={persistor}>
        <App />
        <Recaptcha
					ref={ref => {
						window.recaptcha = ref
					}}
					sitekey={__CAPTCHA_KEY__} />
    </PersistGate>
  </Provider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();