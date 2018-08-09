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
import RestoreBackup from '../../components/RestoreBackup';
import TezosAmount from '../../components/TezosAmount/';
import TezosAddress from '../../components/TezosAddress';

import CreateAccountSlide from '../../components/CreateAccountSlide/';
import { importAddress, gotoHome } from '../../reduxContent/wallet/thunks';
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
    top: 56%;
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
  grid-template-columns: 1fr 1fr;
`;

const ImportButton = styled(Button)`
  width: 194px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

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
  position: relative;
`;



const ShowHidePwd = styled.div`
  position: absolute;
  top: 55%;
  right: ${ms(4)};
  color: ${({ theme: { colors } }) => colors.accent };
  font-size: 12px;
  font-weight: 500;
`;

const FooterContainer = styled.div`
  height: 98px;
  background-color: ${({ theme: { colors } }) => colors.gray1 };
  position: absolute;
  left: 0px;
  width: 100%;
  bottom: -98px;
  padding: 0 2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterContent = styled.div`

`;

const RightTitle = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.black2 };
  line-height: 19px;

`;

const CheckButton = styled(Button)`
  color: ${({ theme: { colors } }) => colors.accent };
  font-size: 12px;
  font-weight: 500;
  margin-top: 10px;
`;

const ConfirmTitle = styled.div`
  font-size: 12px;
  color: ${({ theme: { colors } }) => colors.gray5 };
  line-height: 14px;
  margin-top: 4px;
`;

const BalanceContainer = styled.div`
  display: flex;
  line-height: 16px;
  margin-top: 8px;
`;
const BalanceAmount = styled(TezosAmount)`
  margin-left: 17px;
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

// const PkhTooltip = () => {
//   return (
//     <TooltipContainer>
//       <TooltipTitle>Public key hash</TooltipTitle>
//       This is the public key hash as provided in the paper wallet.
//     </TooltipContainer>
//   );
// };

type Props = {
  importAddress: () => {},
  isLoading: boolean,
  identities: array,
  gotoHome: () => {}
};

class AddAddress extends Component<Props> {
  props: Props;

  state = {
    activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
    seed: '',
    pkh: '',
    activationCode: '',
    username: '',
    passPhrase: '',
    isShowedPwd: false,
    isClickedPublic: false
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

  onCheckAddress = () => {
    const {
      activeTab,
      seed,
      activationCode,
      passPhrase,
      username
    } = this.state;
    this.setState({isClickedPublic: true});
    this.props.importAddress(
      activeTab,
      seed,
      '',
      activationCode,
      username,
      passPhrase,
      true
    );
  }

  importAddress = (status) => {
    if (status) {
      this.props.gotoHome();
    } else {
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
    }    
  };

  onChangeSeed = (seed) => {
    this.setState({ seed, isClickedPublic: false });
  }

  onChangeEmail = (username) => {
    this.setState({ username, isClickedPublic: false });
  }

  onChangePassword = (passPhrase) => {
    this.setState({ passPhrase, isClickedPublic: false });
  }

  onChangeActivationCode = (activationCode) => {
    this.setState({ activationCode, isClickedPublic: false });
  }

  getValue = (jsIdentities) => {
    if (jsIdentities.length) {
      return jsIdentities[0];
    }
    return {publicKeyHash: '', balance: 0};
  }

  renderAddBody() {
    const { activeTab, seed, passPhrase, username, activationCode, isShowedPwd, isClickedPublic } = this.state;
    const { isLoading, identities } = this.props;
    const jsIdentities = identities.toJS();
    const {balance, publicKeyHash} = this.getValue(jsIdentities);
    const isShowPublic = !publicKeyHash || !isClickedPublic;
    switch (activeTab) {
      case ADD_ADDRESS_TYPES.GENERATE_MNEMONIC:
        return <CreateAccountSlide />;
      case ADD_ADDRESS_TYPES.RESTORE:
        return (
          <RestoreBackup />
        )
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
              onChange={(_, newSeed) => this.onChangeSeed(newSeed)}
            />
            <RowInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Email Address"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={username}
                  onChange={(_, newUsername) => this.onChangeEmail(newUsername)}
                />

                <StyledTooltip position="bottom" content={EmailTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Password"
                  type={isShowedPwd? 'text': 'password'}
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={passPhrase}
                  onChange={(_, newPassPhrase) => this.onChangePassword(newPassPhrase)}
                />

                <ShowHidePwd onClick={()=> this.setState({isShowedPwd: !isShowedPwd})} style={{cursor: 'pointer'}}>
                  {isShowedPwd? 'Hide':'Show'}
                </ShowHidePwd>

                <StyledTooltip position="bottom" content={PasswordTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
            </RowInputs>

            <RowInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Activation Code"
                  style={{ width: '100%', padding: `0 ${ms(3)} 0 0` }}
                  value={activationCode}
                  onChange={(_, newActivationCode) => this.onChangeActivationCode(newActivationCode)}
                />
                <StyledTooltip position="bottom" content={ActivationTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon iconName="help" size={ms(0)} color="secondary" />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
              {/* <InputWithTooltip>
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
              </InputWithTooltip> */}
            </RowInputs>
            <FooterContainer>
              <FooterContent>
                <RightTitle>Is this the right account?</RightTitle>
                {isShowPublic && 
                  <CheckButton
                    buttonTheme="plain"
                    onClick={this.onCheckAddress}
                  >
                    Check your public address and balance
                  </CheckButton>
                }
                {!isShowPublic &&
                  <BalanceContainer>
                    <TezosAddress
                      address={publicKeyHash}
                      size="14px"
                      color="primary"
                      color2="gray3"
                    />
                    <BalanceAmount
                      weight='500'
                      color='index0'
                      size='14px'
                      amount={balance}
                    /> 
                  </BalanceContainer>
                }
                {!isShowPublic && !balance &&
                  <ConfirmTitle>
                    Not yours? Make sure you entered the correct information.
                  </ConfirmTitle>
                }
              </FooterContent>
              <ImportButton
                buttonTheme="primary"
                onClick={()=>this.importAddress(!!publicKeyHash)}
                disabled={isLoading}
              >
                Import
              </ImportButton>
            </FooterContainer>            
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
    message: message.get('message'),
    identities: wallet.get('identities')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      importAddress,
      gotoHome
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);
