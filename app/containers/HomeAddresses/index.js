// @flow
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';

import { getIdentities } from '../../reduxContent/wallet/selectors';

import Addresses from '../../components/Addresses/';
import ActionPanel from '../../components/ActionPanel/';

type Props = {
  identities: array,
  match: object
};

const Container = styled.div`
  display: flex;
  padding: ${ms(3)} ${ms(4)};
`;

class AddressPage extends Component<Props> {
  props: Props;

  render() {
    const { match, identities } = this.props;
    const { publicKeyHash } = identities[0];
    const redirectUrl = `${match.url}/${publicKeyHash}/${publicKeyHash}/0`;

    return (
      <Switch>
        <Route
          exact
          path={`${
            match.path
          }/:selectedAccountHash/:selectedParentHash/:addressIndex`}
          render={context => {
            const { params } = context.match;
            return (
              <Container>
                <Addresses {...context} {...params} />
                <ActionPanel
                  key={params.selectedAccountHash}
                  {...context}
                  {...params}
                />
              </Container>
            );
          }}
        />
        <Redirect to={redirectUrl} />
      </Switch>
    );
  }
}

function mapStateToProps(state) {
  return {
    identities: getIdentities(state).toJS()
  };
}

export default connect(
  mapStateToProps,
  null
)(AddressPage);
