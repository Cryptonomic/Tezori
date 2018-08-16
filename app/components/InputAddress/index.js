import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';

import TextField from '../TextField';
import { wrapComponent } from '../../utils/i18n';
import TezosIcon from '../TezosIcon/';
import Button from '../Button/';
import Tooltip from '../Tooltip/';
import { ms } from '../../styles/helpers';

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
  border-bottom:solid 1px #94a9d1;
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
  top: 42px;
`;

type Props = {
  labelText: string,
  changeDelegate: () => {},
  tooltip?: boolean,
  userAddress?: string,
  addressType: 'send' | 'delegate',
  t: () => {},
  onIssue?: () => {}
};

class InputAddress extends React.PureComponent<Props> {
  props: Props;

  state = {
    error: ''
  }
  
  renderToolTipComponent = () => {
    const {t} = this.props;
    return (
      <TooltipContainer>
        <TooltipTitle>{t('general.tooltips.delegate.title')}</TooltipTitle>
        <TooltipContent1>
          {t('general.tooltips.delegate.content1')}
        </TooltipContent1>
        <TooltipContent1>
          {t('general.tooltips.delegate.content2')}
        </TooltipContent1>
        <TooltipContent2>
          {t('general.tooltips.delegate.content3')}
        </TooltipContent2>
      </TooltipContainer>
    );
  };

  validateAddress = (delegateText, changeDelegate, addressType = 'send') => {
    const {t, onIssue} = this.props;
     
    const lengthRegEx = /^([a-zA-Z0-9~%@#$^*/"`'()!_+=[\]{}|\\,.?: -\s]{36})$/;
    const excludeSpecialChars = /[^\w]/;
    const firstCharactersRegEx = addressType === 'send' ? /^(tz1|tz2|tz3|kt1|TZ1|TZ2|TZ3|KT1)/ : /^(tz1|tz2|tz3|TZ1|TZ2|TZ3)/;
    let errorState = true;

    if (!firstCharactersRegEx.test(delegateText) && delegateText !== '') {
      this.setState({
        error: addressType === 'send' ? t('general.errors.address_validation.send_address') :  t('general.errors.address_validation.delegate_address')
      })
    } else if (!lengthRegEx.test(delegateText) && delegateText !== '') {
      this.setState({
        error: t('general.errors.address_validation.length')
      })
    } else if (excludeSpecialChars.test(delegateText) && delegateText !== '') {
      this.setState({
        error: t('general.errors.address_validation.special_chars')
      })
    }  else if ((this.props.userAddress === delegateText) && delegateText !== '') {
      this.setState({
        error:  t('general.errors.address_validation.send_funds')
      })
    } else {
      this.setState({
        error: ''
      })
      errorState = false;
    }

    changeDelegate(delegateText);
    onIssue(errorState);
  }

  render() {
    return (
      <DelegateContainer>
        <TextField
          label={this.props.labelText}
          onChange={(value) => this.validateAddress(value, this.props.changeDelegate, this.props.addressType)}
          errorText={this.state.error}
        />
        {this.props.tooltip &&
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
            <TextfieldTooltip
              buttonTheme="plain"
            >
              <HelpIcon
                iconName="help"
                size={ms(0)}
                color='secondary'
              />
            </TextfieldTooltip>
          </Tooltip>
        }
      </DelegateContainer>
    )
  }
}

InputAddress.defaultProps = {
  onIssue: () => null
}
export default compose(wrapComponent)(InputAddress)
