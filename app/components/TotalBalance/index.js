// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosAmount from '../TezosAmount';
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

const Amount = styled(TezosAmount)`
  display: inline-block;
  margin-left: ${ms(4)};
`;

type Props = {
  totalBalance: string
};

class TotalBalance extends Component {
  render() {
    const { totalBalance = 0 } = this.props;
    return (
      <Container>
        <Text>Total Balance</Text>
        <Amount size={ms(2)} amount={totalBalance} color={'primary'} weight='normal'/>
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
