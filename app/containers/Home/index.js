// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';

import { getIdentities } from '../../redux/wallet/selectors';

import TopBar from '../../components/TopBar/';

import HomeAddresses from './../HomeAddresses/';
import HomeAddAddress from './../HomeAddAddress/'
import HomeSettings from './../HomeSettings/';

type Props = {
  identities: List<Identity>
};

class HomePage extends Component<Props> {
  props: Props;

  render() {
    const { match, identities } = this.props;
    const HomeComponent = !identities || !identities.size ? HomeAddAddress: HomeAddresses
    return (
      <Fragment>
        <TopBar />
        <Switch>
          <Route path={`${match.path}/addresses`} component={HomeAddresses} />
          <Route path={`${match.path}/addAddress`} component={HomeAddAddress} />
          <Route path={`${match.path}/settings`} component={HomeSettings} />
          <Route component={HomeComponent}/>
        </Switch>
      </Fragment>

    );
  }
}

function mapStateToProps(state) {
  return {
    identities: getIdentities(state)
  };
}

export default connect(mapStateToProps)(HomePage);
