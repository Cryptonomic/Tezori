// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Node } from 'react';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import MessageBar from '../../components/MessageBar/';

type Props = {
  children: Node,
  message: object
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 0 ${ms(3)} 0;
`;

class App extends Component<Props> {
  props: Props;

  render() {
    const { message } = this.props;
    return (
      <Container>
        {this.props.children}
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

export default connect(mapStateToProps, null)(App);
