// @flow
import React, { Component, Fragment } from 'react';
import { Dialog, SelectField, MenuItem } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosIcon from '../../components/TezosIcon';
import Button from './../Button/';
import { H2 } from './../Heading/';
import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput'


import { formatAmount, tezToUtez } from '../../utils/currancy';

type Props = {
  low?: number,
  medium?: number,
  high?: number,
  styles?: object,
  underlineStyle?: object,
  fee?: any,
  onChange?: () => {},
  t: () => {}
};

const StyledSaveButton = styled(Button)`
  margin-top: ${ms(4)};
  padding-right: ${ms(9)};
  padding-left: ${ms(9)};
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  height: 20px;
  width: 20px;
  position: absolute;
  top: 10px;
  right: 15px;
`;

class Fee extends Component<Props> {
  props: Props;
  state = {
    open: false,
    custom: ''
  };

  openConfirmation = () => this.setState({ open: true });
  closeConfirmation = () => this.setState({ open: false });
  handleCustomChange = (custom) => this.setState({ custom });
  handleSetCustom = () => {
    const { custom } = this.state;
    const { onChange } = this.props;
    onChange(tezToUtez(custom.replace(/,/g,'.')));
    this.closeConfirmation();
  };

  render() {
    const { open, custom } = this.state;
    const {
      low,
      medium,
      high,
      styles,
      fee,
      onChange,
      underlineStyle,
      t
    } = this.props;

    return (
      <Fragment>
        <SelectField
          floatingLabelText="Fee"
          value={fee}
          style={styles}
          underlineStyle={underlineStyle}
          onChange={(_, index, fee) => {
            if (fee !== 'custom') {
              onChange(fee);
            }
          }}
        >
          <MenuItem
            value={low}
            primaryText={
              <div>
                Low Fee: {formatAmount(low)}{' '}
                <TezosIcon color="black" iconName="tezos" />
              </div>
            }
          />
          <MenuItem
            value={medium}
            primaryText={
              <div>
                Medium Fee: {formatAmount(medium)}{' '}
                <TezosIcon color="black" iconName="tezos" />
              </div>
            }
          />
          <MenuItem
            value={high}
            primaryText={
              <div>
                High Fee: {formatAmount(high)}{' '}
                <TezosIcon color="black" iconName="tezos" />
              </div>
            }
          />
          {custom ? (
            <MenuItem
              value={tezToUtez(custom.replace(/,/g,'.'))}
              primaryText={
                <div>
                  Custom Fee: {formatAmount(tezToUtez(custom.replace(/,/g,'.')))}{' '}
                  <TezosIcon color="black" iconName="tezos" />
                </div>
              }
            />
          ) : null}
          <MenuItem
            value="custom"
            primaryText="Custom"
            onClick={this.openConfirmation}
          />
        </SelectField>
        <Dialog
          modal
          open={open}
          bodyStyle={{ padding: '50px 80px' }}
          titleStyle={{ padding: '50px 70px 0px' }}
        >
          <StyledCloseIcon
            style={{ fill: '#7190C6' }}
            onClick={this.closeConfirmation}
          />
          <div>
            <H2>Enter Custom Amount</H2>
            <TezosNumericInput decimalSeparator={t('general.decimal_separator')} labelText={t('general.custom_fee')} amount={this.state.custom}  handleAmountChange={this.handleCustomChange} />
            <StyledSaveButton
              buttonTheme="primary"
              onClick={this.handleSetCustom}
            >
              Set Custom Fee
            </StyledSaveButton>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

export default compose(wrapComponent, connect())(Fee);
