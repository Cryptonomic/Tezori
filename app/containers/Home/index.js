// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import Transport from '@ledgerhq/hw-transport-node-hid';

import {
  getIdentities,
  getWalletIsLoading,
  getIsLedger
} from '../../reduxContent/wallet/selectors';
import { goHomeAndClearState } from '../../reduxContent/wallet/thunks';
import { addMessage } from '../../reduxContent/message/thunks';
import { initLedgerTransport } from '../../utils/wallet';

import Loader from '../../components/Loader/';
import TopBar from '../../components/TopBar/';
import NodesStatus from '../../components/NodesStatus/';

import HomeAddresses from './../HomeAddresses/';
import HomeAddAddress from './../HomeAddAddress/';
import HomeSettings from './../HomeSettings/';

type Props = {
  identities: List<Identity>,
  isLoading: boolean,
  match: object,
  goHomeAndClearState: () => {},
  addMessage: () => {},
  isLedger: boolean
};

class HomePage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.onDetectLedger();
  }

  onDetectLedger = async () => {
    const { isLedger } = this.props;
    Transport.listen({
      next: e => {
        if (e.type === 'remove' && isLedger) {
          this.onLogout();
        }
      },
      error: e => {
        console.error(e);
      },
      complete: () => {}
    });
  };

  onLogout = () => {
    const { goHomeAndClearState, addMessage } = this.props;
    initLedgerTransport();
    goHomeAndClearState();
    addMessage('general.errors.no_ledger_detected', true);
  };

  render() {
    const { match, identities, isLoading } = this.props;
    const redirectTo =
      !identities || !identities.size
        ? `${match.url}/addAddress`
        : `${match.url}/addresses`;

    return (
      <Fragment>
        <TopBar />
        <NodesStatus />
        <Switch>
          <Route path={`${match.path}/addresses`} component={HomeAddresses} />
          <Route path={`${match.path}/addAddress`} component={HomeAddAddress} />
          <Route path={`${match.path}/settings`} component={HomeSettings} />
          <Redirect to={redirectTo} />
        </Switch>
        {isLoading && <Loader />}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    identities: getIdentities(state),
    isLoading: getWalletIsLoading(state),
    isLedger: getIsLedger(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      goHomeAndClearState,
      addMessage
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
