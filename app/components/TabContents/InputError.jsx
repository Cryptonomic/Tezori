// @flow
import React from 'react';
import { ms } from '../../styles/helpers';
import { ErrorContainer, WarningIcon } from './style';

type Props = {
  error: string
};

function InputError(props: Props) {
  const { error } = props;
  return (
    <ErrorContainer>
      <WarningIcon iconName="warning" size={ms(-1)} color="error1" />
      {error}
    </ErrorContainer>
  );
}

export default InputError;
