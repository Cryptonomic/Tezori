/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, IndexRoute, Redirect } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import AddressPage from './containers/AddressPage';
import SettingsPage from './containers/SettingsPage';
import TopBar from './components/TopBar/';

export default (store) => (
  <App>
    <Switch>
      <Redirect from="/" to="/home" />
      <Route
        path="/home"
        render={(context) => {
          if ( isLoggedIn() ) {
            return <HomePage { ...context } />
          }
          return <Redirect to="/login" />
        }}
      >
        <Route path="/addresses" component={AddressPage} />
        <Route path="/settings" component={SettingsPage} />
        <IndexRoute component={AddressPage}/>
      </Route>
      <Route path="/login" component={Login} >
        <Route path="/loginHome" component={LoginHome} />
        <Route path="/loginImport" component={LoginImport} />
        <Route path="/loginCreate" component={loginCreate} />
        <IndexRoute component={LoginHome}/>
      </Route>

    </Switch>
  </App>
);

//<TopBar />

//<Route path="/addresses" component={AddressPage} />
//<Route path="/settings" component={SettingsPage} />
//  <Route path="/" component={HomePage} />
//  <IndexRoute component={home}/>
