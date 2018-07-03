// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

import TopBar from '../components/TopBar/';

import HomeAddresses from './HomeAddresses/';
import HomeSettings from './HomeSettings/';

class HomePage extends Component<Props> {
  props: Props;

  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <TopBar />
        <Switch>
          <Route path={`${match.path}/addresses`} component={HomeAddresses} />
          <Route path={`${match.path}/settings`} component={HomeSettings} />
          <Route component={HomeAddresses}/>
        </Switch>
      </Fragment>

    );
  }
}

export default connect()(HomePage);
