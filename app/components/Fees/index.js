// @flow
import React, { Component, Fragment } from 'react';
import { TextField, Dialog, SelectField, MenuItem } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosIcon from '../../components/TezosIcon';
import Button from './../Button/';
import { H4, H2 } from './../Heading/';

import { formatAmount, tezToUtez } from '../../utils/currancy';

type Props = {
  low?: number,
  medium?: number,
  high?: number,
  styles?: object,
  underlineStyle?: object,
  fee?: any,
  onChange?: Function
};

const StyledSaveButton = styled(Button)`
  margin-top: ${ms(4)};
  padding-right: ${ms(9)} ;
  padding-left: ${ms(9)} ;
`;

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  height: 20px;
  width: 20px;
  position: absolute;
  top: 10px;
  right: 15px;
`;

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  right: 0px;
  top: 40px;
  display: block;
`

const FeeInput = styled.div`
  position: relative;
`;

class Fee extends Component<Props> {
  props: Props;
  state = {
    open: false,
    custom: ''
  };

  openConfirmation = () =>  this.setState({ open: true });
  closeConfirmation = () =>  this.setState({ open: false });
  handleCustomChange = (_, custom) =>  this.setState({ custom });
  handleSetCustom = () =>  {
    const { custom } = this.state;
    const { onChange } = this.props;
    onChange(tezToUtez(custom));
    this.closeConfirmation();
  };

  render() {
    const { open, custom } = this.state;
    const { low, medium, high, styles, fee, onChange, underlineStyle } = this.props;

    return (
      <Fragment>
        <SelectField
          floatingLabelText="Fee"
          value={fee}
          style={styles}
          underlineStyle={underlineStyle}
          onChange={(_, index, fee) => {
            if( fee !== 'custom' ) {
              onChange(fee);
            }
          }}
        >
          <MenuItem value={low} primaryText={<div>Low Fee: { formatAmount(low)} <TezosIcon color={'black'}/></div>} />
          <MenuItem value={medium} primaryText={<div>Medium Fee: { formatAmount(medium)} <TezosIcon color={'black'}/></div>} />
          <MenuItem value={high} primaryText={ <div>High Fee: { formatAmount(high)} <TezosIcon color={'black'}/></div>} />
          {
            custom
              ? <MenuItem value={tezToUtez(custom)} primaryText={<div>Custom Fee: { formatAmount(tezToUtez(custom))} <TezosIcon color={'black'}/></div>} />
              : null
          }
          <MenuItem value='custom' primaryText="Custom" onClick={this.openConfirmation} />
        </SelectField>
        <Dialog
          modal
          open={open}
          bodyStyle={{ padding: '50px 80px' }}
          titleStyle={{ padding: '50px 70px 0px' }}
        >
          <StyledCloseIcon
            style={{ fill: '#7190C6' }}
            onClick={ this.closeConfirmation }
          />
          <div>
            <H2>Enter Custom Amount</H2>
            <FeeInput>
              <TextField
                floatingLabelText="Custom Fee"
                style={{ width: '100%' }}
                value={custom}
                type="number"
                onChange={this.handleCustomChange}
              />
              <TezosIconInput color='secondary' />
            </FeeInput>

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

export default connect()(Fee);
