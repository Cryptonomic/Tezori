/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App/';
import Home from './containers/Home/';
import Login from './containers/Login/';
import WalletNodesRequired from './components/WalletNodesRequired/';
import { isLoggedIn } from './utils/login';

export default (store) => (
  <App>
    <Switch>
      <Route
        path="/home"
        render={(context) => {
          const state = store.store.getState();

          if ( !isLoggedIn(state) ) {
            return <Redirect to="/login" />
          }

          /*
          if ( !hasNodes(state) ) {
            return <Redirect to="/walletNodesRequired" />
          }
          */

          return <Home { ...context } />
        }}
      />
      <Route path="/walletNodesRequired" component={WalletNodesRequired} />
      <Route path="/login" component={Login} />
      <Redirect from="/" to="/home" />
    </Switch>
  </App>
);

//<Route path="/addresses" component={AddressPage} />
//<Route path="/settings" component={SettingsPage} />
//  <Route path="/" component={HomePage} />
//  <IndexRoute component={home}/>
