// @flow
import React, { Fragment, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import TezosIcon from '../../components/TezosIcon';
import Button from './../Button/';
import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput';
import Modal from '../CustomModal';
import CustomSelect from '../CustomSelect';

import { formatAmount, tezToUtez } from '../../utils/currancy';

const StyledSaveButton = styled(Button)`
  margin-top: ${ms(4)};
  padding-right: ${ms(9)};
  padding-left: ${ms(9)};
`;

const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.primary};
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
  }
`;

const ModalContent = styled.div`
  padding: 35px 76px 63px 76px;
`;

const MiniFeeTitle = styled.div`
  position: relative;
  font-size: 14px;
  line-height: 21px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.black};
  margin: -30px 0 20px 0;
`;

const BoldSpan = styled.span`
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.error1};
`;

const WarningIcon = styled(TezosIcon)`
  padding: 0 ${ms(-9)} 0 0;
  position: relative;
  top: 1px;
`;

const FeeContentWrapper = styled.div``;

type Props = {
  low?: number,
  medium?: number,
  high?: number,
  fee?: number,
  miniFee?: number,
  tooltip?: React.Element,
  onChange?: () => {},
  t: () => {}
};

function Fee(props: Props) {
  const { onChange, low, medium, high, fee, miniFee, tooltip, t } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [custom, setCustom] = useState(() => {
    return fee === low || fee === medium || fee === high
      ? ''
      : formatAmount(fee);
  });

  const renderError = () => {
    return (
      <ErrorContainer>
        <WarningIcon iconName="warning" size={ms(-1)} color="error1" />
        {t('components.fees.minimum_fee_error')}
      </ErrorContainer>
    );
  };

  const handleCustomChange = val => {
    const newErr = val < formatAmount(miniFee) ? renderError() : '';
    setError(newErr);
    setCustom(val);
  };
  const handleSetCustom = () => {
    onChange(tezToUtez(custom.replace(/,/g, '.')));
    setOpen(false);
  };

  const onFeeChange = event => {
    const newFee = event.target.value;
    if (newFee !== 'custom') {
      onChange(newFee);
    } else {
      setOpen(true);
    }
  };

  const customFeeLabel = t('components.fees.custom_fee');
  return (
    <Fragment>
      <CustomSelect
        label={t('general.nouns.fee')}
        value={fee}
        onChange={onFeeChange}
        renderValue={value => {
          let feeTitle = 'components.fees.low_fee';
          if (value === low) {
            feeTitle = 'components.fees.low_fee';
          } else if (value === medium) {
            feeTitle = 'components.fees.medium_fee';
          } else if (value === high) {
            feeTitle = 'components.fees.high_fee';
          } else {
            feeTitle = 'components.fees.custom_fee';
          }
          return (
            <FeeContentWrapper>
              {t(feeTitle)}: {formatAmount(value)}{' '}
              <TezosIcon color="black" iconName="tezos" />
              {tooltip}
            </FeeContentWrapper>
          );
        }}
      >
        <ItemWrapper value={low}>
          {t('components.fees.low_fee')}: {formatAmount(low)}{' '}
          <TezosIcon color="black" iconName="tezos" />
        </ItemWrapper>
        <ItemWrapper value={medium}>
          {t('components.fees.medium_fee')}: {formatAmount(medium)}{' '}
          <TezosIcon color="black" iconName="tezos" />
        </ItemWrapper>
        <ItemWrapper value={high}>
          {t('components.fees.high_fee')}: {formatAmount(high)}{' '}
          <TezosIcon color="black" iconName="tezos" />
        </ItemWrapper>
        {custom ? (
          <ItemWrapper value={tezToUtez(custom.replace(/,/g, '.'))}>
            {customFeeLabel}:{' '}
            {formatAmount(tezToUtez(custom.replace(/,/g, '.')))}{' '}
            <TezosIcon color="black" iconName="tezos" />
          </ItemWrapper>
        ) : null}
        <ItemWrapper value="custom">{t('components.fees.custom')}</ItemWrapper>
      </CustomSelect>
      <Modal
        title={t('components.fees.enter_custom_amount')}
        open={open}
        onClose={() => setOpen(false)}
      >
        <ModalContent>
          <MiniFeeTitle>
            <Trans
              i18nKey="components.fees.required_minium_fee"
              fee={formatAmount(miniFee)}
            >
              Please keep in mind that the minimum required fee for this
              transaction is
              <BoldSpan>{formatAmount(miniFee)} XTZ</BoldSpan>.
            </Trans>
          </MiniFeeTitle>
          <TezosNumericInput
            decimalSeparator={t('general.decimal_separator')}
            labelText={customFeeLabel}
            amount={custom}
            handleAmountChange={handleCustomChange}
            errorText={error}
          />
          <StyledSaveButton
            buttonTheme="primary"
            onClick={handleSetCustom}
            disabled={!!error}
          >
            {t('components.fees.set_custom_fee')}
          </StyledSaveButton>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}

export default wrapComponent(Fee);
