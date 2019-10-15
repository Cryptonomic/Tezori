// @flow
import React from 'react';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import CustomSelect from '../CustomSelect';
import TezosIcon from '../TezosIcon';
import { wrapComponent } from '../../utils/i18n';

import TezosChainFormatArrary from '../../constants/TezosChainFormat';

export const SelectChainRenderWrapper = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 16px;
  font-weight: 500;
  text-transform: capitalize;
`;

export const SelectChainItemWrapper = styled.div`
  margin-left: auto;
  text-transform: capitalize;
`;

export const ChainItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.accent};
    }
    color: ${({ theme: { colors } }) => colors.primary};
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    box-sizing: border-box;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

type Props = {
  t: () => {},
  value: string,
  onChange: () => {}
};

const FormatSelector = (props: Props) => {
  const { t, value, onChange } = props;
  return (
    <CustomSelect
      label={t('general.nouns.format')}
      value={value}
      onChange={event => onChange(event.target.value)}
      renderValue={value => (
        <SelectChainRenderWrapper>{value}</SelectChainRenderWrapper>
      )}
    >
      {TezosChainFormatArrary.map(format => (
        <ChainItemWrapper component="div" key={format} value={format}>
          {format === value && (
            <TezosIcon size="14px" color="accent" iconName="checkmark2" />
          )}
          <SelectChainItemWrapper>{format}</SelectChainItemWrapper>
        </ChainItemWrapper>
      ))}
    </CustomSelect>
  );
};

export default wrapComponent(FormatSelector);
