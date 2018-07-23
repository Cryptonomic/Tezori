import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import { ms } from '../../styles/helpers';

import Button from '../../components/Button/';
import { H4 } from '../../components/Heading/';
import * as ADD_ADDRESS_TYPES from '../../constants/AddAddressTypes';
import Loader from '../../components/Loader/';

import Tooltip from '../../components/Tooltip/';
import TezosIcon from '../../components/TezosIcon/';

import CreateAccountSlide from '../../components/CreateAccountSlide/';
import { importAddress } from '../../reduxContent/wallet/thunks';
import { openLink } from '../../utils/general';

const Container = styled.div`
  width: 80%;
  margin: ${ms(1)} auto 0;
  padding: ${ms(3)} ${ms(4)};
`;

const InputWithTooltip = styled.div`
  position: relative;

  & button {
    position: absolute;
    top: 50%;
    right: ${ms(-2)};
  }
`;

const FormTitle = styled(H4)`
  font-size: ${ms(1)};
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const TooltipContainer = styled.div`
  font-size: ${ms(-1)};
  color: ${({ theme: { colors } }) => colors.primary};
  max-width: ${ms(15.5)};
  font-weight: ${({theme: {typo}}) => typo.weights.light };
`;

const TooltipTitle = styled.p`
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  margin: 0 0 ${ms(-1)} 0;
`;

const RowInputs = styled.div`
  display: grid;
  grid-column-gap: ${ms(1)};
  grid-template-columns: 3fr 4fr;
`;

const ImportButton = styled(Button)`
  margin: ${ms(6)} 0 0 0;
`;

const StyledTooltip = styled(Tooltip)`
  &__tooltip-inner {
    background-color: ${({ theme: { colors } }) =>
      lighten(0.2, colors.secondary)};
  }
`;

const Link = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme: { colors } }) => colors.blue2};
`;

const TitleContainer = styled.div`
  background-color: #417DEF;
  color: white;
  font-size: 24px;
  width: 100%;
  height: 80px;
  padding: 20px 60px;
  display: flex;
  align-items: center;
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  justify-content: space-around;
`;

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
  ${({ isActive }) => {
    if ( isActive ) {
      return css`
        color: #1A325F;
        background-color: white;
        text-align: center;
        padding: 0 10px;
      `;
    }
    return css`
      background-color: #417DEF;
      color: white;
      text-align: center;
      padding: 0 10px;
    `;
  }};
`;

const AddAddressBodyContainer = styled.div`
  background-color: white;
  padding: 2rem;
`;



const PasswordTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Fundraiser Password</TooltipTitle>
      This is the password that you used when generating a Tezos paper wallet to
      participate in the Fundraiser.
    </TooltipContainer>
  );
};

const EmailTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Fundraiser Email Address</TooltipTitle>
      This is the email address that you used when generating a Tezos paper
      wallet to participate in the Fundraiser
    </TooltipContainer>
  );
};

const ActivationTooltip = () => {
  const openALink = () => openLink('https://verification.tezos.com/');
  return (
    <TooltipContainer>
      <TooltipTitle>Activation Code</TooltipTitle>
      This is the activation code that you received after completing the KYC/AML
      process. An activation code corresponds to a public key hash and is
      required if you participated in the Fundraiser. You may complete the
      process at <Link onClick={openALink}>verification.tezos.com</Link> if you
      have not done so already.
    </TooltipContainer>
  );
};

const PkhTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Public key hash</TooltipTitle>
      This is the public key hash as provided in the paper wallet.
    </TooltipContainer>
  );
};

type Props = {
  importAddress: Function,
  isLoading: boolean
};

class AddAddress extends Component<Props> {
  props: Props;

  state = {
    activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
    seed: '',
    pkh: '',
    activationCode: '',
    username: '',
    passPhrase: ''
  };

  renderTab = tabName => {
    const { activeTab } = this.state;

    return (
      <Tab
        key={tabName}
        isActive={tabName === activeTab}
        onClick={() => this.setState({ activeTab: tabName })}
      >
        {tabName}
      </Tab>
    );
  };

  renderTabController = () => {
    return (
      <TabContainer>
        {Object.values(ADD_ADDRESS_TYPES).map(this.renderTab)}
      </TabContainer>
    );
  };

  renderAppBar = () => {
    return (
      <TitleContainer>
        <div>Add an Account</div>
      </TitleContainer>
    );
  };

  importAddress = () => {
    const {
      activeTab,
      seed,
      passPhrase,
      pkh,
      username,
      activationCode
    } = this.state;
    this.props.importAddress(
      activeTab,
      seed,
      pkh,
      activationCode,
      username,
      passPhrase
    );
  };

  renderAddBody() {
    const {
      activeTab,
      seed,
      passPhrase,
      pkh,
      username,
      activationCode
    } = this.state;
    const { isLoading } = this.props;
    switch (activeTab) {
      case ADD_ADDRESS_TYPES.GENERATE_MNEMONIC:
        return <CreateAccountSlide />;
      case ADD_ADDRESS_TYPES.FUNDRAISER:
      default:
        return (
          <Fragment>
            <FormTitle>
              Please refer to the PDF document that you created during the
              Fundraiser.
            </FormTitle>
            <TextField
              floatingLabelText="15 Word Secret Key"
              style={{ width: '100%' }}
              value={seed}
              onChange={(_, newSeed) => this.setState({ seed: newSeed })}
            />
            <RowInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Password"
                  type="password"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={passPhrase}
                  onChange={(_, newPassPhrase) =>
                    this.setState({ passPhrase: newPassPhrase })
                  }
                />

                <StyledTooltip position="bottom" content={PasswordTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>

              <InputWithTooltip>
                <TextField
                  floatingLabelText="Public key hash"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={pkh}
                  onChange={(_, newPkh) => this.setState({ pkh: newPkh })}
                />
                <StyledTooltip position="bottom" content={PkhTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
            </RowInputs>

            <RowInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Email Address"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={username}
                  onChange={(_, newUsername) =>
                    this.setState({ username: newUsername })
                  }
                />

                <StyledTooltip position="bottom" content={EmailTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>

              <InputWithTooltip>
                <TextField
                  floatingLabelText="Activation Code"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={activationCode}
                  onChange={(_, newActivationCode) =>
                    this.setState({ activationCode: newActivationCode })
                  }
                />
                <StyledTooltip position="bottom" content={ActivationTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
            </RowInputs>
            <ImportButton
              buttonTheme="primary"
              onClick={this.importAddress}
              disabled={isLoading}
            >
              Import
            </ImportButton>
          </Fragment>
        );
    }
  }

  render() {
    const { isLoading } = this.props;
    return (
      <Container>
        {this.renderAppBar()}
        {this.renderTabController()}
        <AddAddressBodyContainer>
          {this.renderAddBody()}
          {isLoading && <Loader />}
        </AddAddressBodyContainer>
      </Container>
    );
  }
}

function mapStateToProps({ wallet, message }) {
  return {
    isLoading: wallet.get('isLoading'),
    message: message.get('message')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      importAddress
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);
