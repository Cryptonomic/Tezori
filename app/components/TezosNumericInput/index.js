import * as React from 'react';
import styled from 'styled-components';
import { TextField } from 'material-ui';
import CurrencyInput from 'react-currency-input';

import TezosIcon from '../TezosIcon';

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  right: 0px;
  top: 40px;
  display: block;
`;

const NumericInput = styled.div`
  position: relative;
`;

type Props = {
  handleAmountChange: Function,
  amount: ?number,
  labelText: string
};

const TezosNumericInput = (props: Props) =>
  (
    <NumericInput>
      <TextField
        floatingLabelText={props.labelText}
        style={{ width: '100%' }}
        value={props.amount}
        onChange={props.handleAmountChange}
        type="text"
      >
        <CurrencyInput allowEmpty value={props.amount}  onChangeEvent={props.handleAmountChange} />
      </TextField>
      <TezosIconInput color="secondary" iconName="tezos" />
    </NumericInput>
      );
    
export default TezosNumericInput;