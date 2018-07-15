// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Switch, Route, Redirect } from 'react-router';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';

import { getIdentities } from '../../reduxContent/wallet/selectors';

import Addresses from '../../components/Addresses';
import ActionPanel from '../../components/ActionPanel';


type Props = {
  identities: array
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
    const redirectUrl =`${match.url}/${publicKeyHash}/${publicKeyHash}`;

    return (
    <Switch>
      <Route
        exact
        path={`${match.path}/:selectedAccountHash/:selectedParentHash`}
        render={(context) => {
          const params = context.match.params;
          return (
            <Container>
              <Addresses { ...context } { ...params } />
              <ActionPanel 
                key={ params.selectedAccountHash }
                { ...context }
                { ...params }
              />
            </Container>
          );
        }}
      />
      <Redirect to={redirectUrl}/>
    </Switch>
    );
  }
}

function mapStateToProps(state) {
  return {
    identities: getIdentities(state).toJS()
  };
}

export default connect(mapStateToProps, null)(AddressPage);
