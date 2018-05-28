// @flow
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { TextField } from 'material-ui';

import CreateButton from './CreateButton';
import CREATION_CONSTANTS from './creationConstants';
const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  state = {
    currentDisplay: '',
  };

  changeDisplayAndRoute = (history) => {
    this.setState({ currentDisplay: DEFAULT });
    history.push('/addresses');
  }

  renderRouteButton = () => {
    return (
      <Route render={({ history }) => (
        <CreateButton
          label="Create Wallet"
          style={{
            backgroundColor: '#417DEF',
            color: 'white',
            marginTop: '20px',
          }}
          onClick={() => this.changeDisplayAndRoute(history)}
        />
      )} />
    );
  }
  renderSelectionState = () => {
    return (
      <div className={styles.defaultContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <CreateButton
            label="Create Wallet"
            style={{
              backgroundColor: '#417DEF',
              color: 'white',
              marginTop: '20px',
            }}
            onClick={() => this.setState({ currentDisplay: CREATE })}
          />
        </div>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Import an existing wallet</div>
          <CreateButton
            label="Import Wallet"
            style={{
              border: '2px solid black',
              backgroundColor: 'transparent',
              marginTop: '20px',
            }}
            onClick={() => this.setState({ currentDisplay: IMPORT })}
          />
        </div>
      </div>
    )
  };

  renderCreateWallet = () => {
    return (
      <div className={styles.createContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <TextField
            floatingLabelText="Name Your Wallet"
            style={{ width: '500px' }}
          />
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
          />
          {this.renderRouteButton()}
        </div>
      </div>
    );
  };

  renderImportWallet = () => {
    return (
      <div className={styles.createContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Import your wallet from a backup</div>
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
          />
          {this.renderRouteButton()}
        </div>
      </div>
    );
  };

  render() {
    const { currentDisplay } = this.state;

    switch (currentDisplay) {
      case CREATE:
        return this.renderCreateWallet();
      case IMPORT:
        return this.renderImportWallet();
      case DEFAULT:
      default:
        return this.renderSelectionState();
    }
  }
}
