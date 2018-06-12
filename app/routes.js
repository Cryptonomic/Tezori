/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import AddressPage from './containers/AddressPage';
import TezosLogo from './components/TezosLogo';
import SettingsController from './components/SettingsController';

import styles from './routes.css';

export default () => (
  <App>
    <div className={styles.logoContainer}>
      <TezosLogo />
      <SettingsController />
    </div>
    <Switch>
      <Route path="/addresses" component={AddressPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
