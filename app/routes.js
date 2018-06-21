/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import AddressPage from './containers/AddressPage';
import TotalBalance from './components/TotalBalance';
import TezosLogo from './components/TezosLogo';
import styled from 'styled-components'

import SettingsController from './components/SettingsController';

import styles from './routes.css';

const Container = styled.div`
flex-grow: 1
`

export default () => (
  <App>
    <div className={styles.logoContainer}>
        <TezosLogo />
        <TotalBalance />
      <Container>
        <SettingsController />
      </Container>
    </div>
    <Switch>
      <Route path="/addresses" component={AddressPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
