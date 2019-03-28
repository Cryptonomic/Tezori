import React from 'react';
import styled from 'styled-components';
import SelectField from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const SelectContainer = styled(FormControl)`
  width: 100%;
`;

const LabelWrapper = styled(InputLabel)`
  &&& {
    &[class*='focused'] {    
      color: ${({ theme: { colors } }) => colors.gray3};
    }
    color: rgba(0, 0, 0, 0.38);
    font-size: 16px;
  }
}`;

const SelectWrapper = styled(SelectField)`
  &&& {
    div[class*='select']:focus {
      background: ${({ theme: { colors } }) => colors.transparent};
    }
    div[class*='select'] {
      display: flex;
      align-items: center;
    }

    &:before {
      border-bottom: solid 1px rgba(0, 0, 0, 0.12);
    }
    &:after {
      border-bottom-color: ${({ theme: { colors } }) => colors.accent};
    }
    &:hover:before {
      border-bottom: solid 2px ${({ theme: { colors } }) => colors.accent} !important;
    }
    color: ${({ theme: { colors } }) => colors.primary};
    font-size: 16px;
    font-weight: 300;
  }
`;

type Props = {
  label: string,
  value: string | number | object,
  children?: React.Element,
  renderValue?: () => {},
  onChange: () => {}
};

const CustomSelect = (props: Props) => {
  const { label, value, children, onChange, renderValue, ...others } = props;
  return (
    <SelectContainer>
      <LabelWrapper>{label}</LabelWrapper>
      <SelectWrapper
        value={value}
        onChange={onChange}
        renderValue={renderValue}
        {...others}
      >
        {children}
      </SelectWrapper>
    </SelectContainer>
  );
};

export default CustomSelect;
