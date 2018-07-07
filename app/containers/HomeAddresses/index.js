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
import MessageBar from '../../components/MessageBar';


type Props = {
  message: Object
};

const Container = styled.div`
  display: flex;
  padding: ${ms(3)} ${ms(4)};
`;

class AddressPage extends Component<Props> {
  props: Props;

  render() {
    const { message, match, history, identities } = this.props;
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
              <MessageBar message={message} />
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
  const { message } = state;
  return {
    identities: getIdentities(state).toJS(),
    message: message.get('message')
  };
}

export default connect(mapStateToProps, null)(AddressPage);
