// @flow
import React, { Component, Fragment } from 'react';
import { TextField, Dialog, SelectField, MenuItem } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Button from './../Button/';
import { H4, H2 } from './../Heading/';

import { utezToTez } from '../../utils/currancy';

type Props = {
  low?: number,
  medium?: number,
  high?: number,
  styles?: object,
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
    onChange(custom);
    this.closeConfirmation();
  };

  render() {
    const { open, custom } = this.state;
    const { low, medium, high, styles, fee, onChange } = this.props;

    return (
      <Fragment>
        <SelectField
          floatingLabelText="Fee"
          value={fee}
          style={styles}
          onChange={(_, index, fee) => {
            if( fee !== 'custom' ) {
              onChange(fee);
            }
          }}
        >
          <MenuItem value={low} primaryText={ `Low Fee: ${ utezToTez(low)} ` } />
          <MenuItem value={medium} primaryText={ `Medium Fee: ${ utezToTez(medium)}` } />
          <MenuItem value={high} primaryText={ `High Fee: ${ utezToTez(high)}` } />
          {
            custom
              ? <MenuItem value={custom} primaryText={ `Custom Fee: ${ utezToTez(custom)}` } />
              : null
          }
          <MenuItem value={'custom'} primaryText="Custom" onClick={this.openConfirmation} />
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
          <H2>Enter Custom amount</H2>
          <TextField
            floatingLabelText="Custom Fee"
            style={{ width: '100%' }}
            value={ custom }
            onChange={this.handleCustomChange}
          />

          <StyledSaveButton
            buttonTheme="primary"
            onClick={this.handleSetCustom}
          >
            Set Custom Fee
          </StyledSaveButton>
        </Dialog>
      </Fragment>
    );
  }
}

export default connect()(Fee);
