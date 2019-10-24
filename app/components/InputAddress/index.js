import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { debounce } from 'throttle-debounce';

import TextField from '../TextField';
import { wrapComponent } from '../../utils/i18n';
import TezosIcon from '../TezosIcon/';
import Button from '../Button/';
import Tooltip from '../Tooltip/';
import { ms } from '../../styles/helpers';

import { getAccountFromServer } from '../../reduxContent/generalThunk';

const TooltipContainer = styled.div`
  padding: 10px;
  color: #000;
  font-size: 14px;
  max-width: 312px;
  .customArrow .rc-tooltip-arrow {
    left: 66%;
  }
`;

const TooltipTitle = styled.div`
  color: #123262;
  font-weight: bold;
  font-size: 16px;
`;

const TooltipContent1 = styled.div`
  border-bottom: solid 1px #94a9d1;
  padding: 12px 0;
`;

const TooltipContent2 = styled.div`
  padding: 12px 0;
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const DelegateContainer = styled.div`
  width: 100%;
  position: relative;
  padding-top: 14px;
`;

const TextfieldTooltip = styled(Button)`
  position: absolute;
  right: 10px;
  top: 38px;
`;

type Props = {
  labelText: string,
  onAddressChange: () => {},
  tooltip?: boolean,
  userAddress?: string,
  addressType: 'send' | 'delegate' | 'invoke',
  t: () => {},
  onIssue?: () => {},
  getAccountFromServer: () => {}
};

class InputAddress extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
    this.inputDebounce = debounce(300, this.validateAddress);
  }

  renderToolTipComponent = () => {
    const { t } = this.props;
    return (
      <TooltipContainer>
        <TooltipTitle>
          {t('components.inputAddress.setting_delegate')}
        </TooltipTitle>
        <TooltipContent1>
          {t('components.inputAddress.contents.content1')}
        </TooltipContent1>
        <TooltipContent1>
          {t('components.inputAddress.contents.content2')}
        </TooltipContent1>
        <TooltipContent2>
          {t('components.inputAddress.contents.content3')}
        </TooltipContent2>
      </TooltipContainer>
    );
  };

  getRegExState = (addressType, t) => {
    let firstCharactersRegEx = /^(tz1|tz2|tz3|kt1|TZ1|TZ2|TZ3|KT1)/;
    let regErrorTxt = t('components.inputAddress.errors.send_address');
    if (addressType === 'invoke') {
      firstCharactersRegEx = /^(KT1)/;
      regErrorTxt = t('components.inputAddress.errors.invoke_address');
    } else if (addressType === 'delegate') {
      firstCharactersRegEx = /^(tz1|tz2|tz3|TZ1|TZ2|TZ3)/;
      regErrorTxt = t('components.inputAddress.errors.delegate_address');
    }
    return {
      firstCharactersRegEx,
      regErrorTxt
    };
  };

  validateAddress = async (
    delegateText,
    onAddressChange,
    addressType = 'send'
  ) => {
    const { t, onIssue, getAccountFromServer } = this.props;

    const lengthRegEx = /^([a-zA-Z0-9~%@#$^*/"`'()!_+=[\]{}|\\,.?: -\s]{36})$/;
    const excludeSpecialChars = /[^\w]/;
    const { firstCharactersRegEx, regErrorTxt } = this.getRegExState(
      addressType,
      t
    );
    let errorState = true;
    let error = '';

    if (!firstCharactersRegEx.test(delegateText) && delegateText !== '') {
      error = regErrorTxt;
    } else if (!lengthRegEx.test(delegateText) && delegateText !== '') {
      error = t('components.inputAddress.errors.length');
    } else if (excludeSpecialChars.test(delegateText) && delegateText !== '') {
      error = t('components.inputAddress.errors.special_chars');
    } else if (this.props.userAddress === delegateText && delegateText !== '') {
      error = t('components.inputAddress.errors.send_funds');
    } else {
      errorState = false;
    }

    if (!errorState && delegateText) {
      const account = await getAccountFromServer(delegateText);
      if (!account || account.length === 0) {
        error = t('components.inputAddress.errors.not_exist');
      }
    }
    onAddressChange(delegateText);
    onIssue(!!error);
    this.setState({ error });
  };

  render() {
    const { onAddressChange, addressType } = this.props;
    return (
      <DelegateContainer>
        <TextField
          label={this.props.labelText}
          onChange={value =>
            this.inputDebounce(value, onAddressChange, addressType)
          }
          errorText={this.state.error}
        />
        {this.props.tooltip && (
          <Tooltip
            position="bottom"
            content={this.renderToolTipComponent()}
            align={{
              offset: [70, 0]
            }}
            arrowPos={{
              left: '71%'
            }}
          >
            <TextfieldTooltip buttonTheme="plain">
              <HelpIcon iconName="help" size={ms(1)} color="gray5" />
            </TextfieldTooltip>
          </Tooltip>
        )}
      </DelegateContainer>
    );
  }
}

InputAddress.defaultProps = {
  onIssue: () => null
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAccountFromServer
    },
    dispatch
  );

export default compose(
  wrapComponent,
  connect(
    null,
    mapDispatchToProps
  )
)(InputAddress);
