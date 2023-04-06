import React, { Component, Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes';
import ContentLoader from './components/ContentLoader';
import RenderRemoteComponent from './components/RenderRemoteComponent';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import WizzyTemplates from './components/wizzy-components/WizzyTemplates';

class App extends Component {
  
  componentDidMount(){
    var referrer = document.referrer
    localStorage.setItem('websiteReferrer', referrer);
  }

  render() {      
    return (
      <>
        <BrowserRouter>
          <Suspense fallback={<ContentLoader />}>
            <Switch>
              <Route {...ROUTES.HOME} />
              <Route {...ROUTES.LOGIN} />
              <Route {...ROUTES.LOGOUT} />
              <Route {...ROUTES.ORDERDETAIL} />
              <Route {...ROUTES.NEWRMA} />
              <Route {...ROUTES.VIEWRMA} />
              <Route {...ROUTES.CUSTOMERACCOUNT} />
              <Route {...ROUTES.CHECKOUT} />
              <Route {...ROUTES.SHOPPINGBAG} />
              <Route {...ROUTES.CATALOGSEARCH} />
              <Route {...ROUTES.SUBCATEGORYPRODUCTLIST} />
              <Route {...ROUTES.PRODUCTLIST} />
              <Route {...ROUTES.ORDERCONFIRMED} />
              <Route {...ROUTES.SUBCATPRODUCTDETAIL} />
              <Route {...ROUTES.PRODUCTDETAIL} />
              <Route {...ROUTES.STORES} />
              <Route {...ROUTES.FLASHSALE} />
              <Route {...ROUTES.CHECKDELIVERY} />
              <Route {...ROUTES.CHECKDELIVERYRESULT} />
              <Route {...ROUTES.CONTACTUS} />
              <Route {...ROUTES.NOTFOUND} />
              <Route {...ROUTES.STATICPAGE} />
              <Route {...ROUTES.REVIEWS} />
              <Route {...ROUTES.WIZZY} />
              <Route component={ROUTES.NOTFOUND.component} />
            </Switch>
          </Suspense>
        </BrowserRouter>
        <RenderRemoteComponent />
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.BOTTOM_CENTER} />
        <WizzyTemplates />
      </>
    );
  }
}

export default App;