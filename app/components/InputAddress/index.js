import React from 'react';
import styled from 'styled-components';
import { TextField } from 'material-ui';

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
`;

const TextfieldTooltip = styled(Button)`
  position: absolute;
  right: 10px;
  top: 44px;
`;

const renderToolTipComponent = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Setting a Delegate</TooltipTitle>
      <TooltipContent1>
        You can always change the delegate at a later time.
      </TooltipContent1>
      <TooltipContent1>
        There is a fee for changing the delegate.
      </TooltipContent1>
      <TooltipContent2>
        {
          'You can only delegate to the Manager Address. The Manager Address always starts with "tz1".'
        }
      </TooltipContent2>
    </TooltipContainer>
  );
};

type Props = {
  labelText: string,
  changeDelegate: Function,
  tooltip: boolean,
  userAddress?: string,
  addressType: 'send' | 'delegate'
};


class InputAddress extends React.PureComponent<Props> {
  props: Props;

  state = {
    error: ''
  }

  validateAddress = (event, changeDelegate, addressType = 'send') => {
    const delegateText = event.target.value;
    let firstCharactersRegEx = /^(tz1|tz2|tz3|TZ11|TZ2|TZ3)/;
    const lengthRegEx = /^([a-zA-Z0-9~%@#$^*/"`'()!_+=[\]{}|\\,.?: -\s]{36})$/;
    const excludeSpecialChars = /[^\w]/;

    if(addressType === 'send') {
      firstCharactersRegEx = /^(tz1|tz2|tz3|kt1|TZ11|TZ2|TZ3|KT1)/;
    }

    if (!firstCharactersRegEx.test(delegateText) && delegateText !== '') {
      this.setState({
        error: addressType === 'send' ? 'Addresses can only start TZ1, TZ2, TZ3 or KT1' :  'You can only delegate to TZ1, TZ2 or TZ3 addresses.'
      })
    } else if (!lengthRegEx.test(delegateText) && delegateText !== '') {
      this.setState({
        error: 'Addresses must be 36 characters long.'
      })
    } else if (excludeSpecialChars.test(delegateText) && delegateText !== '') {
      this.setState({
        error: ' Addresses cannot contain any special characters.'
      })
    }  else if ((this.props.userAddress === delegateText) && delegateText !== '') {
      this.setState({
        error: 'You cant send funds to yourself.'
      })
    } else {
      this.setState({
        error: ''
      })

    }

    changeDelegate(delegateText);
  }

  render() {
    return (
      <DelegateContainer>
        <TextField
          floatingLabelText={this.props.labelText}
          style={{ width: '100%' }}
          onChange={(e) => this.validateAddress(e, this.props.changeDelegate, this.props.addressType)}
          errorText={this.state.error}
        />
        {this.props.tooltip &&
          <Tooltip
            position="bottom"
            content={renderToolTipComponent()}
            align={{
              offset: [70, 0]
            }}
            arrowPos={{
              left: '70%'
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

export default InputAddress