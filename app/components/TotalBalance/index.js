// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosAmount from '../TezosAmount';
import { formatAmount } from '../../utils/currancy'
import Tooltip from '../Tooltip'
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
  totalBalance: number
};

class TotalBalance extends Component {
  render() {
    const { totalBalance = 0 } = this.props;
    return (
      <Container>
        <Text>Total Balance</Text>
        <Tooltip position="right" title={ formatAmount(totalBalance) }>
          <Amount size={ms(2)} amount={ formatAmount(totalBalance, 2) } color={'primary'} weight='normal'/>
        </Tooltip>
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
