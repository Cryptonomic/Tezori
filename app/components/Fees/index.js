// @flow
import React, { Component, Fragment } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
      color: ${({ theme: { colors } }) => colors.primary };
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
  }  
`;

const ModalContent = styled.div`
  padding: 35px 76px 63px 76px;
`

class Fee extends Component<Props> {
  props: Props;
  state = {
    open: false,
    custom: ''
  };

  closeConfirmation = () => this.setState({ open: false });
  handleCustomChange = (custom) => this.setState({ custom });
  handleSetCustom = () => {
    const { custom } = this.state;
    const { onChange } = this.props;
    onChange(tezToUtez(custom.replace(/,/g,'.')));
    this.closeConfirmation();
  };

  onFeeChange = event => {
    const fee = event.target.value;
    const {onChange} = this.props;
    if (fee !== 'custom') {
      onChange(fee);
    } else {
      this.setState({ open: true });
    }
  }

  render() {
    const { open, custom } = this.state;
    const {
      low,
      medium,
      high,
      fee,
      t
    } = this.props;

    return (
      <Fragment>
        <CustomSelect
          label='Fee'
          value={fee}
          onChange={this.onFeeChange}
        >
          <ItemWrapper value={low}>
            Low Fee: {formatAmount(low)}{' '}
            <TezosIcon color="black" iconName="tezos" />
          </ItemWrapper>
          <ItemWrapper value={medium}>
            Medium Fee: {formatAmount(medium)}{' '}
            <TezosIcon color="black" iconName="tezos" />
          </ItemWrapper>
          <ItemWrapper value={high}>
            High Fee: {formatAmount(high)}{' '}
            <TezosIcon color="black" iconName="tezos" />
          </ItemWrapper>
          {custom ? (
            <ItemWrapper value={tezToUtez(custom.replace(/,/g,'.'))}>
              Custom Fee: {formatAmount(tezToUtez(custom.replace(/,/g,'.')))}{' '}
              <TezosIcon color="black" iconName="tezos" />
            </ItemWrapper>
          ) : null}
          <ItemWrapper value="custom">
            Custom
          </ItemWrapper>
        </CustomSelect>
        <Modal
          title='Enter Custom Amount'
          open={open}
          onClose={this.closeConfirmation}
        >
          <ModalContent>
            <TezosNumericInput decimalSeparator={t('general.decimal_separator')} labelText={t('general.custom_fee')} amount={this.state.custom}  handleAmountChange={this.handleCustomChange} />
            <StyledSaveButton
              buttonTheme="primary"
              onClick={this.handleSetCustom}
            >
              Set Custom Fee
            </StyledSaveButton>
          </ModalContent>
        </Modal>
      </Fragment>
    );
  }
}

export default compose(wrapComponent, connect())(Fee);
