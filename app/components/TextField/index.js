import React from 'react';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import NumberFormat from 'react-number-format';

const Container = styled(FormControl)`
  width: 100%;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

const InputWrapper = styled(Input)`
  &&& {
    &[class*='focused'] {    
      &:after {
        border-bottom-color: ${({ error, theme: { colors } }) =>
          error ? colors.error1 : colors.accent};
      }
    }
    color: ${({ disabled, theme: { colors } }) =>
      disabled ? colors.gray5 : colors.primary};
    font-size: 16px;
    font-weight: 300;
    padding-right: ${({ right }) => right}px;
    &:before {
      border-bottom: ${({ disabled }) =>
        disabled
          ? '1px dotted rgba(0, 0, 0, 0.32)'
          : '1px solid rgba(0, 0, 0, 0.12)'} ;
    }
    &:hover:before {
      border-bottom: solid 2px ${({ error, theme: { colors } }) =>
        error ? colors.error1 : colors.accent} !important;
    }    
  }
}`;
const LabelWrapper = styled(InputLabel)`
  &&& {
    &[class*='focused'] {    
      color: ${({ theme: { colors } }) => colors.gray3};
    }
    color: rgba(0, 0, 0, 0.38);
    font-size: 16px;
  }
}`;

const ErrorText = styled(FormHelperText)`
  &&& {
    color: ${({ theme: { colors } }) => colors.error1};
    font-size: 12px;
    margin-top: 5px;
    line-height: 18px;
    height: 18px;
  }
}`;

type Props1 = {
  inputRef: () => {},
  onChange: () => {}
};

const NumberFormatCustom = (props: Props1) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      type="text"
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator
    />
  );
};

type Props = {
  label: string,
  type?: string,
  errorText?: string | React.Node,
  disabled?: boolean,
  right?: number,
  onChange?: () => {}
};

const TextField = (props: Props) => {
  const { label, type, onChange, errorText, disabled, right, ...other } = props;
  return (
    <Container disabled={disabled}>
      <LabelWrapper>{label}</LabelWrapper>
      <InputWrapper
        key={label}
        type={type}
        onChange={event => onChange(event.target.value)}
        error={!!errorText}
        disabled={disabled}
        right={right}
        inputComponent={type === 'number' ? NumberFormatCustom : null}
        {...other}
      />
      <ErrorText component="div">{errorText}</ErrorText>
    </Container>
  );
};
TextField.defaultProps = {
  type: 'text',
  errorText: '',
  disabled: false,
  right: 0
};

export default TextField;
