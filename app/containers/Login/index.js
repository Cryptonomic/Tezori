// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

import { getWalletIsLoading } from '../../reduxContent/wallet/selectors';
import { getNewVersion } from '../../reduxContent/message/selectors';

import Loader from '../../components/Loader/';
import TopBar from '../../components/TopBar/';
import VersionStatus from '../../components/VersionStatus';
import LoginHome from './../LoginHome/';
import LoginImport from './../LoginImport/';
import LoginCreate from './../LoginCreate/';
import LoginConditions from './../LoginConditions/';
import HomeSettings from './../HomeSettings/';

type Props = {
  isLoading: boolean,
  match: object,
  newVersion: string
};

class LoginPage extends Component<Props> {
  props: Props;

  render() {
    const { match, isLoading, newVersion } = this.props;

    return (
      <Fragment>
        <TopBar onlyLogo />
        {newVersion && <VersionStatus version={newVersion} />}
        <Switch>
          <Route path={`${match.path}/home`} component={LoginHome} />
          <Route path={`${match.path}/import`} component={LoginImport} />
          <Route path={`${match.path}/create`} component={LoginCreate} />
          <Route
            path={`${match.path}/conditions/:type`}
            component={LoginConditions}
          />
          <Route path={`${match.path}/settings`} component={HomeSettings} />
          <Route component={LoginHome} />
        </Switch>
        {isLoading && <Loader />}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: getWalletIsLoading(state),
    newVersion: getNewVersion(state)
  };
}

export default connect(mapStateToProps)(LoginPage);
