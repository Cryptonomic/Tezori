import * as React from 'react';
import styled from 'styled-components';
import TextField from '../TextField';

import TezosIcon from '../TezosIcon/';

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  right: 0px;
  top: 26px;
  display: block;
`;

const NumericInput = styled.div`
  position: relative;
`;

const validateInput = (amount, handleChange, decimalSeparator) => {
  const separator = decimalSeparator;
  const preventSeparatorAtStart = new RegExp(`^[${separator}]`,"g");
  const allowOnlyNumbers = new RegExp(`[^0-9${separator}]`,"g");
  const allowOnlyOneSeparator = new RegExp(`\\${separator}`,"g");
  let counter = 0;

  let validatedAmount = amount
    .replace(preventSeparatorAtStart, '')
    .replace(allowOnlyNumbers, '')
    .replace(allowOnlyOneSeparator, () => {counter += 1; return counter > 1 ? '' : separator});

  const precisionCount = validatedAmount.includes(separator) ? validatedAmount.split(separator)[1].length : 0;
  if (precisionCount > 6) {
    const splitedAmount = validatedAmount.split(separator);
    const fractional = splitedAmount[1].substring(0, 6);
    validatedAmount = `${splitedAmount[0]}${separator}${fractional}`;
  }

  handleChange(validatedAmount);
};

type Props = {
  handleAmountChange: () => {},
  amount: ?string,
  labelText: string,
  decimalSeparator: string
};

const TezosNumericInput = (props: Props) =>
  (
    <NumericInput>
      <TextField
        label={props.labelText}
        value={props.amount}
        onChange={(newVal) => validateInput(newVal, props.handleAmountChange, props.decimalSeparator)}
        type="text"
      />
      <TezosIconInput color="secondary" iconName="tezos" />
    </NumericInput>
  );

export default TezosNumericInput;