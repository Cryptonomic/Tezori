// @flow
import React, { Component, Fragment } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosIcon from '../../components/TezosIcon';
import Button from './../Button/';
import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput';
import Modal from '../CustomModal';
import CustomSelect from '../CustomSelect';

import { formatAmount, tezToUtez } from '../../utils/currancy';

type Props = {
  low?: number,
  medium?: number,
  high?: number,
  fee?: number,
  onChange?: () => {},
  t: () => {}
};

const StyledSaveButton = styled(Button)`
  margin-top: ${ms(4)};
  padding-right: ${ms(9)};
  padding-left: ${ms(9)};
`;

const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.primary};
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
  }
`;

const ModalContent = styled.div`
  padding: 35px 76px 63px 76px;
`;

const MiniFeeTitle = styled.div`
  position: relative;
  font-size: 14px;
  line-height: 21px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.black};
  margin: -30px 0 20px 0;
`;

const BoldSpan = styled.span`
  font-weight: 500;
`;

class Fee extends Component<Props> {
  props: Props;
  state = {
    open: false,
    custom: ''
  };

  closeConfirmation = () => this.setState({ open: false });
  handleCustomChange = custom => this.setState({ custom });
  handleSetCustom = () => {
    const { custom } = this.state;
    const { onChange } = this.props;
    onChange(tezToUtez(custom.replace(/,/g, '.')));
    this.closeConfirmation();
  };

  onFeeChange = event => {
    const fee = event.target.value;
    const { onChange } = this.props;
    if (fee !== 'custom') {
      onChange(fee);
    } else {
      this.setState({ open: true });
    }
  };

  render() {
    const { open, custom } = this.state;
    const { low, medium, high, fee, t } = this.props;
    const customFeeLabel = t('components.fees.custom_fee');

    return (
      <Fragment>
        <CustomSelect
          label={t('general.nouns.fee')}
          value={fee}
          onChange={this.onFeeChange}
        >
          <ItemWrapper value={low}>
            {t('components.fees.low_fee')}: {formatAmount(low)}{' '}
            <TezosIcon color="black" iconName="tezos" />
          </ItemWrapper>
          <ItemWrapper value={medium}>
            {t('components.fees.medium_fee')}: {formatAmount(medium)}{' '}
            <TezosIcon color="black" iconName="tezos" />
          </ItemWrapper>
          <ItemWrapper value={high}>
            {t('components.fees.high_fee')}: {formatAmount(high)}{' '}
            <TezosIcon color="black" iconName="tezos" />
          </ItemWrapper>
          {custom ? (
            <ItemWrapper value={tezToUtez(custom.replace(/,/g, '.'))}>
              {customFeeLabel}:{' '}
              {formatAmount(tezToUtez(custom.replace(/,/g, '.')))}{' '}
              <TezosIcon color="black" iconName="tezos" />
            </ItemWrapper>
          ) : null}
          <ItemWrapper value="custom">
            {t('components.fees.custom')}
          </ItemWrapper>
        </CustomSelect>
        <Modal
          title={t('components.fees.enter_custom_amount')}
          open={open}
          onClose={this.closeConfirmation}
        >
          <ModalContent>
            <MiniFeeTitle>
              <Trans
                i18nKey="components.fees.required_minium_fee"
                fee={formatAmount(low)}
              >
                Please keep in mind that the minimum required fee for this
                transaction is
                <BoldSpan>{formatAmount(low)} XTZ</BoldSpan>.
              </Trans>
            </MiniFeeTitle>
            <TezosNumericInput
              decimalSeparator={t('general.decimal_separator')}
              labelText={customFeeLabel}
              amount={this.state.custom}
              handleAmountChange={this.handleCustomChange}
            />
            <StyledSaveButton
              buttonTheme="primary"
              onClick={this.handleSetCustom}
            >
              {t('components.fees.set_custom_fee')}
            </StyledSaveButton>
          </ModalContent>
        </Modal>
      </Fragment>
    );
  }
}

export default compose(
  wrapComponent,
  connect()
)(Fee);
