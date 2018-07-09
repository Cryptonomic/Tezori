// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';

type Props = {
  children: Node
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 0 ${ms(3)} 0;
`;

export default class App extends Component<Props> {
  props: Props;

  render() {
    return <Container>{this.props.children}</Container>;
  }
}
