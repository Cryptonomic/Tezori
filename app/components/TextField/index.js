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

const TextAreaWrapper = styled(Input)`
  &&& {
    &[class*='focused'] {    
      &:after {
        border-bottom-color: ${({ error, theme: { colors } }) =>
          error ? colors.error1 : colors.accent};
      }
    }
    background-color: ${({ theme: { colors } }) => colors.gray14};
    border: 1px solid ${({ theme: { colors } }) => colors.gray14};
    font-size: 14px;
    color: ${({ theme: { colors } }) => colors.blue5};
    padding: 10px 22px 5px 22px;
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
    color: ${({ multiline, theme: { colors } }) =>
      multiline ? colors.gray15 : 'rgba(0, 0, 0, 0.38)'};
    z-index: ${({ multiline }) => (multiline ? 10 : 0)};
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
  multiline?: boolean,
  onChange?: () => {}
};

const TextField = (props: Props) => {
  const {
    label,
    type,
    onChange,
    errorText,
    disabled,
    right,
    multiline,
    ...other
  } = props;
  return (
    <Container disabled={disabled}>
      <LabelWrapper multiline={multiline ? 1 : 0}>{label}</LabelWrapper>
      {multiline ? (
        <TextAreaWrapper
          key={label}
          onChange={event => onChange(event.target.value)}
          right={right}
          multiline
          {...other}
        />
      ) : (
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
      )}
      <ErrorText component="div">{errorText}</ErrorText>
    </Container>
  );
};
TextField.defaultProps = {
  type: 'text',
  errorText: '',
  disabled: false,
  right: 0,
  multiline: false
};

export default TextField;
