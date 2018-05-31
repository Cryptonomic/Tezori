// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { TextField } from 'material-ui';

import CreateButton from './CreateButton';
import CREATION_CONSTANTS from './creationConstants';
import { setAddress, setPassword } from '../reducers/walletInitialization';

const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

import styles from './Home.css';

type Props = {};

class Home extends Component<Props> {
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
    const { address, password, setAddress, setPassword } = this.props;

    return (
      <div className={styles.createContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <TextField
            floatingLabelText="Name Your Wallet"
            style={{ width: '500px' }}
            value={address}
            onChange={(_, newAddress) => setAddress(newAddress)}
          />
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
            type="password"
            value={password}
            onChange={(_, newPass) => setPassword(newPass)}
          />
          {this.renderRouteButton()}
        </div>
      </div>
    );
  };

  renderImportWallet = () => {
    const { password, setPassword } = this.props;

    return (
      <div className={styles.createContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Import your wallet from a backup</div>
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
            type="password"
            value={password}
            onChange={(_, newPass) => setPassword(newPass)}
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

function mapStateToProps(state) {
  return {
    address: state.walletInitialization.get('address'),
    password: state.walletInitialization.get('password'),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setAddress,
    setPassword,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
