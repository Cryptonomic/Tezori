// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

import TopBar from '../../components/TopBar/';
import LoginHome from './../LoginHome/';
import LoginImport from './../LoginImport/';
import LoginCreate from './../LoginCreate/';

class LoginPage extends Component<Props> {
  props: Props;

  render() {
    const { match } = this.props;

    return (
      <Fragment>
        <TopBar onlyLogo />
        <Switch>
          <Route path={`${match.path}/home`} component={LoginHome} />
          <Route path={`${match.path}/import`} component={LoginImport} />
          <Route path={`${match.path}/create`} component={LoginCreate} />
          <Route component={LoginHome}/>
        </Switch>
      </Fragment>
    );
  }
}

export default connect()(LoginPage);