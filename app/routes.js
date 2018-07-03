/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App/';
import Home from './containers/Home/';
import Login from './containers/Login/';
import WalletNodesRequired from './containers/WalletNodesRequired/';
import { isLoggedIn } from './utils/login';
import { hasNodes } from './utils/nodes';
import { getIdentities } from './redux/wallet/selectors';

export default (store) => (
  <App>
    <Switch>
      <Route
        path="/home"
        render={(context) => {
          const state = store.store.getState();
          if ( !hasNodes(state) ) {
            return <Redirect to="/walletNodesRequired" />
          }

          if ( !isLoggedIn(state) ) {
            return <Redirect to="/login" />
          }

          return <Home { ...context } />
        }}
      />
      <Route path="/walletNodesRequired" component={WalletNodesRequired} />
      <Route path="/login" component={Login} />
      <Redirect from="/" to="/home" />
    </Switch>
  </App>
);