// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosAmount from '../TezosAmount';
import { getTotalBalance } from '../../reduxContent/wallet/selectors';
import { wrapComponent } from '../../utils/i18n';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  font-size: ${ms(1)};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.gray3};
  padding-left: ${ms(2)};
`;

const Amount = styled(TezosAmount)`
  margin: 0 ${ms(2)};
`;

type Props = {
  totalBalance: number,
  t: () => {}
};

class TotalBalance extends Component<Props> {
  render() {
    const { totalBalance, t } = this.props;
    return (
      <Container>
        <Text>{t('general.nouns.total_balance')}</Text>
        <Amount
          size={ms(3)}
          amount={totalBalance}
          color="primary"
          weight="normal"
          showTooltip
          format={2}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    totalBalance: getTotalBalance(state)
  };
};

export default compose(
  wrapComponent,
  connect(
    mapStateToProps,
    null
  )
)(TotalBalance);
