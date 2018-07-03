// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';

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
    const { message } = this.props;

    return (
      <Container>
        <Addresses />
        <ActionPanel />
        <MessageBar message={message} />
      </Container>
    );
  }
}

function mapStateToProps({ message }) {
  return {
    message: message.get('message')
  };
}

export default connect(mapStateToProps, null)(AddressPage);
