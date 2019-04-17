import React from 'react';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const Container = styled(FormControl)`
  width: 100%;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

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
      transform: translate(0, 1.5px) scale(0.75);
    }
    color: ${({ theme: { colors } }) => colors.gray15};
    z-index: 10;
    font-size: 16px;
    pointer-events: none;
    transform: translate(22px, 34px) scale(1);
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

type Props = {
  label: string,
  errorText?: string | React.Node,
  disabled?: boolean,
  onChange?: () => {}
};

const CustomTextArea = (props: Props) => {
  const { label, onChange, errorText, disabled, ...other } = props;
  return (
    <Container disabled={disabled}>
      <LabelWrapper>{label}</LabelWrapper>
      <TextAreaWrapper
        key={label}
        onChange={event => onChange(event.target.value)}
        multiline
        {...other}
      />
      <ErrorText component="div">{errorText}</ErrorText>
    </Container>
  );
};
CustomTextArea.defaultProps = {
  errorText: '',
  disabled: false
};

export default CustomTextArea;
