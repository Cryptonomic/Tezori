// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';

import {
  getIdentities,
  getWalletIsLoading
} from '../../reduxContent/wallet/selectors';

import Loader from '../../components/Loader/';
import TopBar from '../../components/TopBar/';
import NodesStatus from '../../components/NodesStatus/';

import HomeAddresses from './../HomeAddresses/';
import HomeAddAddress from './../HomeAddAddress/';
import HomeSettings from './../HomeSettings/';

type Props = {
  identities: List<Identity>,
  isLoading: boolean,
  match: object
};

class HomePage extends Component<Props> {
  props: Props;

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
    isLoading: getWalletIsLoading(state)
  };
}

export default connect(mapStateToProps)(HomePage);
