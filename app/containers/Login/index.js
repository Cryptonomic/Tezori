// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

import { getWalletIsLoading } from '../../reduxContent/wallet/selectors';

import Loader from '../../components/Loader/';
import TopBar from '../../components/TopBar/';
import LoginHome from './../LoginHome/';
import LoginImport from './../LoginImport/';
import LoginCreate from './../LoginCreate/';
import LoginConditions from './../LoginConditions/';

type Props = {
  isLoading: boolean,
  match: Object
};

class LoginPage extends Component<Props> {
  props: Props;

  render() {
    const { match, isLoading } = this.props;

    return (
      <Fragment>
        <TopBar onlyLogo />
        <Switch>
          <Route path={`${match.path}/home`} component={LoginHome} />
          <Route path={`${match.path}/import`} component={LoginImport} />
          <Route path={`${match.path}/create`} component={LoginCreate} />
          <Route
            path={`${match.path}/conditions/:type`}
            component={LoginConditions}
          />
          <Route component={LoginHome} />
        </Switch>
        {isLoading && <Loader />}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: getWalletIsLoading(state)
  };
}

export default connect(mapStateToProps)(LoginPage);
