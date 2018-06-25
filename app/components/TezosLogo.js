// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Button from './Button';
import TezosIcon from './TezosIcon';
import { goHomeAndClearState } from '../reducers/walletInitialization.duck';
import { ms } from '../styles/helpers';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

type Props = {
  goHomeAndClearState: Function
};

class TezosLogo extends Component<Props> {
  render() {
    const { goHomeAndClearState } = this.props;
    return (
      <Container>
        <Button onClick={goHomeAndClearState} buttonTheme="plain">
          <TezosIcon iconName="tezos" size={ms(7)} color="accent" />
        </Button>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ goHomeAndClearState }, dispatch);

export default connect(null, mapDispatchToProps)(TezosLogo);
