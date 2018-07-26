import * as React from 'react';
import styled from 'styled-components';
import { TextField } from 'material-ui';

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

const validateInput = (event, handleChange) => {
  const amount = event.target.value;
  let counter = 0;

  let validatedAmount = amount
    .replace(/^[.]/gi, '')
    .replace(/[^0-9.]/gi, '')
    .replace(/\./g, () => counter++ ? '' : '.');

  const precisionCount = validatedAmount.includes('.') ? validatedAmount.split(".")[1].length : 0;
  if (precisionCount > 6) {
    const splitedAmount = validatedAmount.split(".");
    const fractional = splitedAmount[1].substring(0, 6);
    validatedAmount = `${splitedAmount[0]}.${fractional}`;
  };

  handleChange(validatedAmount);
};

type Props = {
  handleAmountChange: Function,
  amount: ?string,
  labelText: string
};

const TezosNumericInput = (props: Props) =>
  (
    <NumericInput>
      <TextField
        floatingLabelText={props.labelText}
        style={{ width: '100%' }}
        value={props.amount}
        onChange={(e) => validateInput(e, props.handleAmountChange)}
        type="text"
      />
      <TezosIconInput color="secondary" iconName="tezos" />
    </NumericInput>
  );

export default TezosNumericInput;