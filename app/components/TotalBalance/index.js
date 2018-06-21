// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import tezosLogo from '../../../resources/tezosLogo.png';
import { getTotalBalance } from '../../reducers/address.duck';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  font-size: ${ms(0)};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.gray3};
  padding-left: ${ms(2)};
`;

const Total = styled.span`
  font-size: ${ms(2)};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  color: ${({ theme: { colors } }) => colors.primary};
  padding-left: ${ms(4)};
`;

const TezosLogo = styled.img`
  height: ${ms(2)};
  filter: brightness(40%);
`;

type Props = {
  totalBalance: number
};

class TotalBalance extends Component {
  render() {
    const { totalBalance = 0 } = this.props;
    return (
      <Container>
        <Text>Total Balance</Text>
        <Total>{totalBalance}</Total>
        <TezosLogo alt="tez" src={tezosLogo} />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    totalBalance: getTotalBalance(state)
  };
};

export default connect(mapStateToProps, null)(TotalBalance);
